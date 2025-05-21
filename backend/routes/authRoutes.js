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

module.exports = router;