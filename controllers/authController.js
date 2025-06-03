const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResetEmail = require("../utils/email");


const SECRET = process.env.JWT_SECRET || "yoursecretkey";

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashed,
    });

    // Save the user
    await user.save();

    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.error(err);
  }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};







// @desc Request password reset
exports.requestPasswordReset = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username, email });
    if (!user) return res.status(404).json({ message: "No user found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const resetLink = `http://127.0.0.1:5502/frontend/resetPassword.html?token=${token}`;


    await sendResetEmail(email, resetLink);

    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("❌ Error sending reset email:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Handle password reset
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

