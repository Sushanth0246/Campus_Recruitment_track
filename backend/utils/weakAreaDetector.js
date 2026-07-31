/**
 * Weak Area Detection Engine
 * ---------------------------
 * Aggregates a user's performance across Aptitude categories, Coding topics,
 * and Interview rounds into a single 0-100 "mastery score" per area, then
 * flags anything below a threshold as a weak area with a targeted tip.
 */

const WEAK_THRESHOLD = 60;

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// --- Aptitude: mastery = average accuracy across attempts in a category ---
function scoreAptitudeCategories(attempts) {
  const byCategory = {};
  attempts.forEach((a) => {
    if (!byCategory[a.category]) byCategory[a.category] = [];
    byCategory[a.category].push(a.accuracy);
  });

  return Object.entries(byCategory).map(([category, accuracies]) => ({
    area: category,
    type: "Aptitude",
    score: Math.round(average(accuracies)),
    attempts: accuracies.length,
  }));
}

// --- Coding: mastery blends solve rate and self-reported confidence ---
function scoreCodingTopics(submissions) {
  const byTopic = {};
  submissions.forEach((s) => {
    if (!byTopic[s.topic]) byTopic[s.topic] = [];
    byTopic[s.topic].push(s);
  });

  return Object.entries(byTopic).map(([topic, subs]) => {
    const solveRate = (subs.filter((s) => s.status === "Solved").length / subs.length) * 100;
    const confidence = average(subs.map((s) => s.confidence)) * 20; // scale 1-5 -> 20-100
    const score = Math.round(solveRate * 0.65 + confidence * 0.35);
    return { area: topic, type: "Coding", score, attempts: subs.length };
  });
}

// --- Interview: mastery = average overall score scaled to 100 ---
function scoreInterviewRounds(interviews) {
  const byRound = {};
  interviews.forEach((i) => {
    if (!byRound[i.round]) byRound[i.round] = [];
    byRound[i.round].push(i.overallScore);
  });

  return Object.entries(byRound).map(([round, scores]) => ({
    area: round,
    type: "Interview",
    score: Math.round(average(scores) * 10), // scale 1-10 -> 10-100
    attempts: scores.length,
  }));
}

function buildTip(entry) {
  const tips = {
    Aptitude: `Spend 20 focused minutes daily on ${entry.area} drills before moving to new topics.`,
    Coding: `Revisit ${entry.area} fundamentals and solve 3 Easy problems before attempting Medium ones.`,
    Interview: `Do a focused mock ${entry.area} round with a peer and record it for self-review.`,
  };
  return tips[entry.type] || "Keep practicing consistently in this area.";
}

/**
 * @returns {{ allAreas: Array, weakAreas: Array, radarData: Array }}
 */
function detectWeakAreas({ aptitudeAttempts = [], codingSubmissions = [], mockInterviews = [] }) {
  const allAreas = [
    ...scoreAptitudeCategories(aptitudeAttempts),
    ...scoreCodingTopics(codingSubmissions),
    ...scoreInterviewRounds(mockInterviews),
  ];

  const weakAreas = allAreas
    .filter((a) => a.score < WEAK_THRESHOLD)
    .sort((a, b) => a.score - b.score)
    .map((a) => ({ ...a, tip: buildTip(a) }));

  const radarData = allAreas.map((a) => ({ subject: a.area, score: a.score, fullMark: 100 }));

  return { allAreas, weakAreas, radarData, threshold: WEAK_THRESHOLD };
}

module.exports = { detectWeakAreas, WEAK_THRESHOLD };
