const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true }, // Add email as a required field
  password: { type: String, required: true },
  lastVisit: { type: Date, default: Date.now },
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
