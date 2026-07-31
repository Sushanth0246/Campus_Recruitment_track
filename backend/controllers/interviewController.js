const MockInterview = require("../models/MockInterview");

// @route POST /api/interview/log
const logInterview = async (req, res) => {
  const { round, communicationScore, technicalScore, confidenceScore, problemSolvingScore, feedback } = req.body;

  if (!round || !communicationScore || !technicalScore || !confidenceScore || !problemSolvingScore) {
    return res.status(400).json({ message: "All score fields and round are required" });
  }

  const overallScore = Math.round(
    (Number(communicationScore) + Number(technicalScore) + Number(confidenceScore) + Number(problemSolvingScore)) / 4
  );

  const interview = await MockInterview.create({
    user: req.user._id,
    round,
    communicationScore,
    technicalScore,
    confidenceScore,
    problemSolvingScore,
    overallScore,
    feedback,
  });

  res.status(201).json({ interview });
};

// @route GET /api/interview/history
const getHistory = async (req, res) => {
  const interviews = await MockInterview.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ interviews });
};

module.exports = { logInterview, getHistory };
