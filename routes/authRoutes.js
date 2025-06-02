const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");


router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);


router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
