const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.BASE_URL}/api/verify-email/${token}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };