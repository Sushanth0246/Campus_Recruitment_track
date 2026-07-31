/**
 * Ranking Engine
 * --------------
 * Computes a single composite "Readiness Score" (0-1000) per user from
 * their activity across all three practice modules, so the leaderboard
 * rewards well-rounded prep rather than just one module.
 *
 * Weights: Aptitude 30%, Coding 45%, Interview 25%
 * (coding is weighted highest since most campus drives filter on it first)
 */

const WEIGHTS = { aptitude: 0.3, coding: 0.45, interview: 0.25 };

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function aptitudeComponent(attempts) {
  if (!attempts.length) return 0;
  const accuracy = average(attempts.map((a) => a.accuracy)); // 0-100
  const volumeBonus = Math.min(attempts.length * 2, 20); // up to +20 for consistent practice
  return Math.min(accuracy + volumeBonus, 100);
}

function codingComponent(submissions) {
  if (!submissions.length) return 0;
  const difficultyWeight = { Easy: 1, Medium: 1.5, Hard: 2 };
  const solved = submissions.filter((s) => s.status === "Solved");
  const weightedSolved = solved.reduce((sum, s) => sum + (difficultyWeight[s.difficulty] || 1), 0);
  const solveScore = Math.min((weightedSolved / (submissions.length * 1.2)) * 100, 100);
  const confidence = average(submissions.map((s) => s.confidence)) * 20;
  return Math.round(solveScore * 0.7 + confidence * 0.3);
}

function interviewComponent(interviews) {
  if (!interviews.length) return 0;
  return Math.round(average(interviews.map((i) => i.overallScore)) * 10); // 1-10 -> 10-100
}

/**
 * @returns {{ readinessScore: number, breakdown: object }}
 */
function computeReadinessScore({ aptitudeAttempts = [], codingSubmissions = [], mockInterviews = [] }) {
  const aptitude = Math.round(aptitudeComponent(aptitudeAttempts));
  const coding = Math.round(codingComponent(codingSubmissions));
  const interview = Math.round(interviewComponent(mockInterviews));

  const composite = aptitude * WEIGHTS.aptitude + coding * WEIGHTS.coding + interview * WEIGHTS.interview;
  const readinessScore = Math.round(composite * 10); // scale 0-100 -> 0-1000

  return {
    readinessScore,
    breakdown: { aptitude, coding, interview, weights: WEIGHTS },
  };
}

/**
 * Ranks a list of { userId, name, ...scoreInputs } by readiness score, descending.
 */
function buildLeaderboard(users) {
  const scored = users.map((u) => {
    const { readinessScore, breakdown } = computeReadinessScore(u);
    return { ...u, readinessScore, breakdown };
  });

  scored.sort((a, b) => b.readinessScore - a.readinessScore);
  return scored.map((u, idx) => ({ ...u, rank: idx + 1 }));
}

module.exports = { computeReadinessScore, buildLeaderboard, WEIGHTS };
