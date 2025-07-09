// utils/mailHelper.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"STC App 👨‍💻" <${process.env.EMAIL_USER}>`,
    to,         // receiver
    subject,    // subject line
    text,       // plain text
    // html: "<b>Hello</b>", // optional
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
