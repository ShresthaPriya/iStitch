const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // Add missing import

const forgetPassword = async (req, res) => {
  try {
    console.log("Password reset request received for:", req.body.email);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, don't reveal this for security reasons
    if (!user) {
      console.log("Password reset requested for non-existent email:", email);
      return res.status(200).json({ 
        success: true, 
        message: "If your email is registered, you will receive a new password." 
      });
    }

    // Generate a new random password (8 characters with letters and numbers)
    const newPassword = crypto.randomBytes(4).toString('hex');
    
    console.log(`Generated new temporary password for ${email}: ${newPassword}`);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password in database
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password updated in database for user: ${user._id}`);

    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPassword) {
      console.warn("Email credentials missing! Returning password in response for development purposes only.");
      // ONLY FOR DEVELOPMENT/TESTING - remove in production
      return res.status(200).json({
        success: true,
        message: "Email service is not configured. Your new password is displayed below (for development purposes only).",
        devInfo: {
          password: newPassword,
          note: "This password display is for development purposes only and should be removed in production."
        }
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Email configuration with the new password
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "Your New Password - iStitch",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Your Password Has Been Reset</h2>
          <p>Hello ${user.fullname || 'Valued Customer'},</p>
          <p>As requested, we've reset your password. Here is your new temporary password:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
            <p style="font-family: monospace; font-size: 18px; font-weight: bold; margin: 0;">${newPassword}</p>
          </div>
          
          <p><strong>Please log in with this password and change it immediately for security reasons.</strong></p>
          <p>If you did not request this password reset, please contact our support team immediately.</p>
          <p>Thank you,<br>iStitch Team</p>
        </div>
      `,
    };

    // Send the email with new password using Promise instead of callback
    try {
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending password reset email:", err);
            reject(err);
          } else {
            console.log("Password reset email sent:", info.response);
            resolve(info);
          }
        });
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "A new password has been sent to your email address. Please check your inbox." 
      });
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
      
      // Email sending failed but password was updated
      return res.status(200).json({
        success: true,
        message: "Your password has been reset, but we couldn't send the email. Please contact support for assistance.",
        passwordResetSuccessful: true
      });
    }
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred. Please try again later." 
    });
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