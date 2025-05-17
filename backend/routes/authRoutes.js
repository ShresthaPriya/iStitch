const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Replace import with require
const { forgetPassword, resetPassword } = require("../controller/user/forgetPasswordController");
const {
  googleAuth,
  googleCallback,
  loginSuccess,
  loginFailed,
  logout,
} = require("../controller/user/authController");

// Add User model import
const User = require("../models/User");

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