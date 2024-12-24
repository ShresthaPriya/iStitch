const express = require("express");
const {
    Login,
    googleLogin,
    googleCallback,
    googleSuccess,
    configureGoogleStrategy,
} = require("../controller/user/Login");

const router = express.Router();

// Configure Google Strategy
configureGoogleStrategy();

// Routes
router.post("/login", Login); // Regular login
router.get("/google", googleLogin); // Google login
router.get("/google/callback", googleCallback, googleSuccess); // Google callback and success

module.exports = router;
