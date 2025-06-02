// helpers/email.js

const nodemailer = require("nodemailer");

const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"CrimeMap Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your CrimeMap password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
  console.log("✅ Reset email sent to", to);
};

module.exports = sendResetEmail;
