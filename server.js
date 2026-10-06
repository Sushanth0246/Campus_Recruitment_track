const express = require("express");
const cors = require("cors");
const connectDB = require("./backend/config/db");
const { errorHandler, notFound } = require("./backend/middleware/errorHandler");

const authRoutes = require("./backend/routes/authRoutes");
const aptitudeRoutes = require("./backend/routes/aptitudeRoutes");
const codingRoutes = require("./backend/routes/codingRoutes");
const interviewRoutes = require("./backend/routes/interviewRoutes");
const dashboardRoutes = require("./backend/routes/dashboardRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "campus-placement-tracker-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;