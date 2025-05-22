const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs"); // Make sure bcrypt is imported
const jwt = require("jsonwebtoken"); // Make sure jwt is imported
const User = require("../models/UserSchema"); // Make sure User model is imported

// Replace import with require
const { forgetPassword, resetPassword } = require("../controller/user/forgetPasswordController");
const {
  googleAuth,
  googleCallback,
  loginSuccess,
  loginFailed,
  logout,
} = require("../controller/user/authController");

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
router.post("/forgot-password", forgetPassword); // Add an alias for the route with a different name format
router.post("/reset-password/:token", resetPassword);

// Add admin login route
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find the admin user
    const user = await User.findOne({ email });

    // Check if user exists and has admin role
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    // Generate JWT token with admin role
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send success response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

module.exports = router;