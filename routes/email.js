
const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ensure the User model is correctly imported
const router = express.Router();
require('dotenv').config();



// In-memory storage for OTPs - for demonstration purposes only.
// In a real application, use a database to store OTPs securely.
const otps = {};

// Function to generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Configure the transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

// Route to send OTP via email
router.post('/send', async (req, res) => {
  const { to } = req.body;
  const otp = generateOTP();
  const subject = 'Your OTP Code';
  const text = `Your OTP code is ${otp}. Please use this code to complete your verification.`;

  try {
    await sendEmail({ to, subject, text });
    // Store OTP with the associated email in memory (or use a database)
    otps[to] = otp;
    console.log(otp)
    res.status(200).send({ message: 'OTP sent successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to send OTP', error });
  }
});

// Route to verify OTP and reset password
router.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log(req.body)
  if (otps[email] === otp) {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log(hashedPassword)
      // Update the user's password in the database
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      
      // Clear the OTP
      delete otps[email];
      res.status(200).send({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to reset password', error });
    }
  } else {
    res.status(400).send({ message: 'Invalid OTP' });
  }
});


module.exports = router;
