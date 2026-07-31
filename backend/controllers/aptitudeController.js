const AptitudeQuestion = require("../models/AptitudeQuestion");
const AptitudeAttempt = require("../models/AptitudeAttempt");

// @route GET /api/aptitude/questions?category=Quantitative&limit=10
const getQuestions = async (req, res) => {
  const { category, limit = 10, difficulty } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await AptitudeQuestion.aggregate([
    { $match: filter },
    { $sample: { size: Number(limit) } },
  ]);

  res.json({ questions });
};

// @route POST /api/aptitude/submit
// body: { category, answers: [{ questionId, selectedOptionIndex }], timeTakenSeconds }
const submitAttempt = async (req, res) => {
  const { category, answers = [], timeTakenSeconds = 0 } = req.body;

  if (!category || !answers.length) {
    return res.status(400).json({ message: "category and answers are required" });
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  let correctAnswers = 0;
  const review = answers.map((a) => {
    const q = questionMap.get(a.questionId);
    const isCorrect = q && q.correctOptionIndex === a.selectedOptionIndex;
    if (isCorrect) correctAnswers += 1;
    return {
      questionId: a.questionId,
      question: q ? q.question : null,
      selectedOptionIndex: a.selectedOptionIndex,
      correctOptionIndex: q ? q.correctOptionIndex : null,
      isCorrect: !!isCorrect,
      explanation: q ? q.explanation : "",
    };
  });

  const accuracy = Math.round((correctAnswers / answers.length) * 100);

  const attempt = await AptitudeAttempt.create({
    user: req.user._id,
    category,
    totalQuestions: answers.length,
    correctAnswers,
    timeTakenSeconds,
    accuracy,
  });

  res.status(201).json({ attempt, review });
};

// @route GET /api/aptitude/history
const getHistory = async (req, res) => {
  const attempts = await AptitudeAttempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ attempts });
};

module.exports = { getQuestions, submitAttempt, getHistory };
