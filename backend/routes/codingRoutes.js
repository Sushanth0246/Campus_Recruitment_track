const express = require("express");
const { getProblems, logSubmission, getHistory } = require("../controllers/codingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/problems", getProblems);
router.post("/log", logSubmission);
router.get("/history", getHistory);

module.exports = router;
