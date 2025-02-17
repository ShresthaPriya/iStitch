const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin login function
const LoginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "All the fields must be filled." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.status(400).json({ success: false, error: "Admin not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid password." });
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Admin login successful!",
            token,
            user,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { LoginAdmin };