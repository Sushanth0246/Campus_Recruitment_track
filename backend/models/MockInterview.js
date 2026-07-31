const mongoose = require("mongoose");

// A completed mock interview session with per-round scoring
const mockInterviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    round: {
      type: String,
      required: true,
      enum: ["Technical", "HR", "Group Discussion", "Managerial"],
    },
    communicationScore: { type: Number, min: 1, max: 10, required: true },
    technicalScore: { type: Number, min: 1, max: 10, required: true },
    confidenceScore: { type: Number, min: 1, max: 10, required: true },
    problemSolvingScore: { type: Number, min: 1, max: 10, required: true },
    overallScore: { type: Number, min: 1, max: 10, required: true },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
