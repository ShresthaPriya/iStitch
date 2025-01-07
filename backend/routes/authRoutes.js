const express = require("express");
const passport = require("passport");
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
router.get("/google", (req, res, next) => {
  console.log("Google Auth route hit");
  next();
}, googleAuth);

// Google callback URL
router.get("/google/callback", googleCallback);

// Login success handler
router.get("/login/success", loginSuccess);

// Login failure handler
router.get("/login/failed", loginFailed);

// Logout handler
router.get("/logout", logout);

router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
