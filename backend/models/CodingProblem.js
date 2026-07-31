const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: {
      type: String,
      required: true,
      enum: ["Arrays", "Strings", "Linked List", "Trees & Graphs", "Dynamic Programming", "Recursion", "Sorting & Searching"],
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    description: { type: String, required: true },
    link: { type: String, default: "" }, // e.g. LeetCode / HackerRank link for the actual problem
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodingProblem", codingProblemSchema);
