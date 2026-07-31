const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    college: { type: String, default: "" },
    branch: { type: String, default: "" },
    graduationYear: { type: Number },
    targetRole: { type: String, default: "Software Engineer" },
    avatarColor: {
      type: String,
      default: () => ["#F5A623", "#2DD4BF", "#6C5CE7", "#EF6461"][Math.floor(Math.random() * 4)],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
