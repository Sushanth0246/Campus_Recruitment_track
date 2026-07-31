const express = require("express");
const { logInterview, getHistory } = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.post("/log", logInterview);
router.get("/history", getHistory);

module.exports = router;
