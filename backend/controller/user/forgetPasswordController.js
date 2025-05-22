const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const forgetPassword = async (req, res) => {
  try {
    console.log("Forgot password request received:", req.body);
    const { email } = req.body;  // Ensure email is destructured correctly

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, don't disclose this but log it server-side
    if (!user) {
      console.log(`Password reset attempted for non-existent email: ${email}`);
      // Still return success to prevent email enumeration attacks
      return res.status(200).json({ success: true, message: "If the email exists, a reset link was sent." });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // Store the reset token and expiry in the user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Create email transporter with correct credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true, // Enable debugging for troubleshooting
    });

    // Log email configuration (without password)
    console.log("Email configuration:", {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD ? "******" : "NOT SET"
      }
    });

    // Base URL for the frontend reset page
    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetURL = `${clientURL}/reset-password/${token}`;

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password - iStitch",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #4a5568;">Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetURL}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Your Password</a>
          </div>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have questions.</p>
          <p>Best regards,<br>The iStitch Team</p>
        </div>
      `,
    };

    // Verify connection before sending
    transporter.verify(function(error, success) {
      if (error) {
        console.error("SMTP verification error:", error);
        return res.status(500).json({ success: false, message: `Email configuration error: ${error.message}` });
      } else {
        console.log("SMTP server is ready to send messages");
        
        // Send the email
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
            return res.status(500).json({ success: false, message: `Email sending failed: ${err.message}` });
          }
          console.log("Password reset email sent:", info.response);
          res.status(200).json({ success: true, message: "Email sent successfully" });
        });
      }
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: `Internal Server Error: ${err.message}` });
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
