const User = require("../../models/UserSchema"); // Ensure you're using the correct model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { googleLogin, googleCallback } = require("./authController");
  

// Add credentials in registration
const addCredentials = async (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    // Validate input fields
    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, error: "All fields must be filled" });
    }
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // Validate password strength (at least 8 characters, 1 letter, 1 number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;  // Minimum 8 characters, at least one letter and one number

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, error: "Password must be at least 8 characters long, and contain at least one letter and one number." });
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    try {
        // Check if user already exists
        const existsUser = await User.findOne({ email });
        if (existsUser) {
            return res.status(400).json({
                success: false,
                field: "email",
                code: "duplicate",
                message: "This email is already registered. Please use a different email or log in."
                });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user (do not include confirmPassword)
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        // Exclude sensitive data (password) from the response
        newUser.password = undefined;

        return res.status(201).json({ success: true, user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
// Add Google OAuth login
addCredentials.googleLogin = googleLogin;
addCredentials.googleCallback = googleCallback;

module.exports = { addCredentials };
