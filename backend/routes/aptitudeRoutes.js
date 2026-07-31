const express = require("express");
const { getQuestions, submitAttempt, getHistory } = require("../controllers/aptitudeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/questions", getQuestions);
router.post("/submit", submitAttempt);
router.get("/history", getHistory);

module.exports = router;
