const User = require("../models/User");
const AptitudeAttempt = require("../models/AptitudeAttempt");
const CodingSubmission = require("../models/CodingSubmission");
const MockInterview = require("../models/MockInterview");
const { detectWeakAreas } = require("../utils/weakAreaDetector");
const { computeReadinessScore, buildLeaderboard } = require("../utils/rankingEngine");

async function gatherUserActivity(userId) {
  const [aptitudeAttempts, codingSubmissions, mockInterviews] = await Promise.all([
    AptitudeAttempt.find({ user: userId }),
    CodingSubmission.find({ user: userId }),
    MockInterview.find({ user: userId }),
  ]);
  return { aptitudeAttempts, codingSubmissions, mockInterviews };
}

// @route GET /api/dashboard/summary
// Personal dashboard: readiness score, weak areas, recent activity counts
const getSummary = async (req, res) => {
  const activity = await gatherUserActivity(req.user._id);
  const { readinessScore, breakdown } = computeReadinessScore(activity);
  const { weakAreas, radarData } = detectWeakAreas(activity);

  res.json({
    readinessScore,
    breakdown,
    weakAreas,
    radarData,
    stats: {
      aptitudeAttempts: activity.aptitudeAttempts.length,
      codingSubmissions: activity.codingSubmissions.length,
      problemsSolved: activity.codingSubmissions.filter((s) => s.status === "Solved").length,
      mockInterviews: activity.mockInterviews.length,
    },
  });
};

// @route GET /api/dashboard/progress
// Time-series data for line charts: accuracy over time, problems solved over time
const getProgress = async (req, res) => {
  const { aptitudeAttempts, codingSubmissions, mockInterviews } = await gatherUserActivity(req.user._id);

  const aptitudeTrend = aptitudeAttempts
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((a) => ({ date: a.createdAt.toISOString().slice(0, 10), accuracy: a.accuracy }));

  const codingTrend = codingSubmissions
    .sort((a, b) => a.createdAt - b.createdAt)
    .reduce((acc, s) => {
      const date = s.createdAt.toISOString().slice(0, 10);
      const last = acc[acc.length - 1];
      const solvedSoFar = (last ? last.solvedCumulative : 0) + (s.status === "Solved" ? 1 : 0);
      acc.push({ date, solvedCumulative: solvedSoFar });
      return acc;
    }, []);

  const interviewTrend = mockInterviews
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((i) => ({ date: i.createdAt.toISOString().slice(0, 10), overallScore: i.overallScore, round: i.round }));

  res.json({ aptitudeTrend, codingTrend, interviewTrend });
};

// @route GET /api/dashboard/leaderboard
// Global leaderboard across all registered users
const getLeaderboard = async (req, res) => {
  const users = await User.find().select("_id name college avatarColor");

  const usersWithActivity = await Promise.all(
    users.map(async (u) => {
      const activity = await gatherUserActivity(u._id);
      return {
        userId: u._id,
        name: u.name,
        college: u.college,
        avatarColor: u.avatarColor,
        ...activity,
      };
    })
  );

  const leaderboard = buildLeaderboard(usersWithActivity).map((u) => ({
    rank: u.rank,
    userId: u.userId,
    name: u.name,
    college: u.college,
    avatarColor: u.avatarColor,
    readinessScore: u.readinessScore,
    breakdown: u.breakdown,
  }));

  const currentUserEntry = leaderboard.find((u) => u.userId.toString() === req.user._id.toString());

  res.json({ leaderboard, currentUserRank: currentUserEntry ? currentUserEntry.rank : null });
};

module.exports = { getSummary, getProgress, getLeaderboard };
