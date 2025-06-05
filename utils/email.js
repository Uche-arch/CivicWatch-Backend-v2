// helpers/email.js

const nodemailer = require("nodemailer");

const sendResetEmail = async (to, resetLink) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Not loaded"
  );
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"Phylax360 Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your Phylax360 account password",
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your password for your Phylax360 account.</p>
      <p>If you made this request, you can reset your password by clicking the link below:</p>
      <p><a href="${resetLink}">Reset your password</a></p>
      <p><strong>This link will expire in 15 minutes.</strong></p>
      <p>If you did <strong>not</strong> request a password reset, please ignore this email. No changes will be made to your account.</p>
      <p>Stay safe,<br>The Phylax360 Team</p>
    `,
  });
  console.log("✅ Reset email sent to", to);
};

module.exports = sendResetEmail;
