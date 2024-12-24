const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login function
const Login = async (req, res) => {
    const { email, password } = req.body;  // Corrected: req.body, not res.body

    // Check if email or password is missing
    if (!email || !password) {
        return res.status(400).json({ success: false, error: "All the fields must be filled." });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format." });
    }

    try {
        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "User not found." });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);  // Corrected: password, not passwors
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid password." });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude password from response
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { Login };
