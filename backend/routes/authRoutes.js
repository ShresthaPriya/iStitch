const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
// Replace import with require
const { forgetPassword, resetPassword } = require("../controller/user/forgetPasswordController");
const {
  googleAuth,
  googleCallback,
  loginSuccess,
  loginFailed,
  logout,
} = require("../controller/user/authController");

// Import necessary modules
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();
const { addCredentials } = require("../controller/user/RegistrationController");
const { Login } = require("../controller/user/Login");

router.post("/register", addCredentials); // Register route
router.post("/login", Login); // Login route

// Initiates Google login
router.get("/google/login", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: true,
  state: "login", // Pass state to indicate login
}));

// Initiates Google sign-up
router.get("/google/signup", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: true,
  state: "signup", // Pass state to indicate sign-up
}));

// Google callback URL
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=Authentication failed. Please sign up first.`,
  })(req, res, next);
}, (req, res) => {
  const action = req.query.state; // signup or login
  if (action === "signup") {
    return res.redirect(`${process.env.CLIENT_URL}/home?action=signup`);
  }
  if (action === "login") {
    return res.redirect(`${process.env.CLIENT_URL}/home?action=login`);
  }
  return res.redirect(`${process.env.CLIENT_URL}/login?error=Invalid action`);
});


// Login success handler
router.get("/login/success", loginSuccess);

// Login failure handler
router.get("/login/failed", loginFailed);

// Logout handler
router.get("/logout", logout);

router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);

// Generate random password (8 characters)
const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received forgot password request for:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // If user doesn't exist, still return success (security best practice)
    if (!user) {
      console.log('User not found with email:', email);
      return res.json({
        success: true,
        message: 'If your email is registered, you will receive instructions to reset your password.'
      });
    }
    
    // Generate a new random password (make it more user-friendly)
    const newPassword = Math.random().toString(36).slice(-8);
    console.log(`Generated new password for user ${user._id}: ${newPassword}`);
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log(`Password hashed. Updating in database for user: ${user._id}`);
    
    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();
    
    console.log(`User ${user._id} password updated successfully`);
    
    // Send email with new password
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>Hello ${user.fullname || 'User'},</p>
        <p>Your password has been reset as requested. Here is your new password:</p>
        <p style="background-color: #f5f5f5; padding: 10px; font-family: monospace; font-size: 16px;">${newPassword}</p>
        <p>Please login with this new password and consider changing it immediately for security reasons.</p>
        <p>If you did not request this password reset, please contact us immediately.</p>
        <p>Thank you,<br>iStitch Team</p>
      </div>
    `;
    
    try {
      console.log(`Attempting to send password reset email to: ${email}`);
      
      // Check if sendEmail function exists and is properly imported
      if (typeof sendEmail !== 'function') {
        console.error('sendEmail function is not available. Make sure it is properly imported.');
        throw new Error('Email sending function not available');
      }
      
      const emailResult = await sendEmail(
        email,
        'iStitch Password Reset',
        emailContent
      );
      
      console.log('Email sending result:', emailResult);
      
      // If you're not receiving emails, log the current email configuration
      console.log('Email configuration:', {
        emailUser: process.env.EMAIL_USER,
        emailPasswordSet: !!process.env.EMAIL_PASSWORD
      });
      
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Still continue since password was reset successfully
    }
    
    return res.json({
      success: true,
      message: 'If your email is registered, you will receive instructions to reset your password.'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.json({
      success: true,
      message: 'If your email is registered, you will receive instructions to reset your password.'
    });
  }
});

// Admin login route
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate admin credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("Attempting admin login for:", email);
    console.log("Admin email from env:", adminEmail);

    if (email === adminEmail && password === adminPassword) {
      // Generate token with admin role
      const token = jwt.sign(
        { 
          id: 'admin', 
          email: adminEmail, 
          role: 'admin' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log("Admin login successful using environment credentials");
      return res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          id: 'admin',
          email: adminEmail,
          role: 'admin',
          fullname: 'Admin'
        }
      });
    }

    // If credentials don't match, check if it's a user with admin role
    console.log("Checking for admin user in database");
    const user = await User.findOne({ email });
    
    if (user && user.role === 'admin') {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        // Generate token for admin user
        const token = jwt.sign(
          { 
            id: user._id, 
            email: user.email, 
            role: 'admin' 
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        console.log("Admin login successful using database user");
        return res.json({
          success: true,
          message: 'Admin login successful',
          token,
          user: {
            id: user._id,
            email: user.email,
            role: 'admin',
            fullname: user.fullname
          }
        });
      }
    }

    // If we get here, the login failed
    console.log("Admin login failed for:", email);
    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during admin login'
    });
  }
});

module.exports = router;