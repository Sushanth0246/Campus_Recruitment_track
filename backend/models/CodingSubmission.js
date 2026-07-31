const mongoose = require("mongoose");

// Self-reported submission log: user marks a problem solved/attempted and
// how long it took + confidence, which feeds the weak-area engine.
const codingSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem", required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    status: { type: String, enum: ["Solved", "Attempted", "Failed"], required: true },
    timeTakenMinutes: { type: Number, default: 0 },
    confidence: { type: Number, min: 1, max: 5, default: 3 }, // self-rated 1-5
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodingSubmission", codingSubmissionSchema);
