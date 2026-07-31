const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  college: user.college,
  branch: user.branch,
  graduationYear: user.graduationYear,
  targetRole: user.targetRole,
  avatarColor: user.avatarColor,
});

// @route POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, college, branch, graduationYear, targetRole } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const user = await User.create({ name, email, password, college, branch, graduationYear, targetRole });
  const token = signToken(user._id);

  res.status(201).json({ token, user: sanitizeUser(user) });
};

// @route POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user._id);
  res.json({ token, user: sanitizeUser(user) });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

// @route PUT /api/auth/me
const updateMe = async (req, res) => {
  const fields = ["name", "college", "branch", "graduationYear", "targetRole"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) req.user[f] = req.body[f];
  });
  await req.user.save();
  res.json({ user: sanitizeUser(req.user) });
};

module.exports = { register, login, getMe, updateMe };
