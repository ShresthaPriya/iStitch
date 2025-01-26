const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;  // Ensure email is destructured correctly

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, send error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
        <p>The link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: `Email sending failed: ${err.message}` });
      }
      res.status(200).send({ message: "Email sent successfully" });
    });
  } catch (err) {
    res.status(500).send({ message: `Internal Server Error: ${err.message}` });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Retrieve the token from the URL params

    // Verify the token sent by the user
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is invalid or expired, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid or expired token" });
    }

    // Find the user with the id from the token
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).send({ message: "No user found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt); // Store hashed password

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ message: `Internal Server Error: ${err.message}` });
  }
};

module.exports = { forgetPassword, resetPassword };
