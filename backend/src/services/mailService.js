// src/services/mailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"NoReply" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
  return info;
};
