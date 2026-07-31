const mongoose = require("mongoose");

// One document per practice session (a batch of questions attempted together)
const aptitudeAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    accuracy: { type: Number, required: true }, // percentage 0-100
  },
  { timestamps: true }
);

module.exports = mongoose.model("AptitudeAttempt", aptitudeAttemptSchema);
