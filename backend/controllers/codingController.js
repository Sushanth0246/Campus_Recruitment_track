const CodingProblem = require("../models/CodingProblem");
const CodingSubmission = require("../models/CodingSubmission");

// @route GET /api/coding/problems?topic=Arrays&difficulty=Easy
const getProblems = async (req, res) => {
  const { topic, difficulty } = req.query;
  const filter = {};
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const problems = await CodingProblem.find(filter).sort({ createdAt: 1 });
  res.json({ problems });
};

// @route POST /api/coding/log
// body: { problemId, status, timeTakenMinutes, confidence }
const logSubmission = async (req, res) => {
  const { problemId, status, timeTakenMinutes = 0, confidence = 3 } = req.body;

  if (!problemId || !status) {
    return res.status(400).json({ message: "problemId and status are required" });
  }

  const problem = await CodingProblem.findById(problemId);
  if (!problem) return res.status(404).json({ message: "Problem not found" });

  const submission = await CodingSubmission.create({
    user: req.user._id,
    problem: problem._id,
    topic: problem.topic,
    difficulty: problem.difficulty,
    status,
    timeTakenMinutes,
    confidence,
  });

  res.status(201).json({ submission });
};

// @route GET /api/coding/history
const getHistory = async (req, res) => {
  const submissions = await CodingSubmission.find({ user: req.user._id })
    .populate("problem", "title topic difficulty link")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ submissions });
};

module.exports = { getProblems, logSubmission, getHistory };
