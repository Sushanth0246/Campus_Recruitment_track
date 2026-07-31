const express = require("express");
const { getSummary, getProgress, getLeaderboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/progress", getProgress);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
