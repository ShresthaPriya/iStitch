const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Improved Login function with detailed logging
exports.Login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "All the fields must be filled." });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format." });
    }

    try {
        // Use case-insensitive query for email
        console.log('Searching for user with email (case-insensitive):', email);
        const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        
        // Debug: Log all users to see if email formats match
        console.log('All users in database:');
        const allUsers = await User.find({}, 'email');
        console.log(allUsers.map(u => u.email));
        
        if (!user) {
            console.log(`Login failed: User not found with email ${email}`);
            return res.status(400).json({ success: false, error: "User not found." });
        }

        // Log found user details for debugging
        console.log('Found user:', {
            id: user._id,
            email: user.email,
            fullname: user.fullname
        });

        // Compare plain text password with hashed password in database
        console.log(`Comparing password for user: ${user._id}`);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result: ${isMatch}`);

        if (!isMatch) {
            console.log(`Login failed: Invalid password for user ${user._id}`);
            return res.status(400).json({ success: false, error: "Invalid password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log(`Login successful for user: ${user._id}`);
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                _id: user._id, // Include both id and _id for compatibility
                email: user.email,
                fullname: user.fullname,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
};

// Google OAuth functions
exports.googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
});

exports.googleSuccess = (req, res) => {
    const user = req.user;

    User.findOne({ googleId: user.id }, async (err, existingUser) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        
        if (!existingUser) {
            const newUser = new User({
                googleId: user.id,
                fullname: user.displayName,
                email: user.emails[0].value,
                password: null, // Google login doesn't need a password
            });

            await newUser.save();
            return res.status(200).json({
                success: true,
                message: "Google login successful! New user created.",
                token: jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
                user: newUser,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Google login successful!",
            token: jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
            user: existingUser,
        });
    });
};