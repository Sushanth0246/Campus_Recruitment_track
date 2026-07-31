const mongoose = require("mongoose");

// Question bank for aptitude practice, grouped by category so weak-area
// detection can report performance per topic (Quant, Logical, Verbal, DI).
const aptitudeQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Quantitative", "Logical Reasoning", "Verbal Ability", "Data Interpretation"],
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: (v) => v.length === 4 },
    correctOptionIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);
