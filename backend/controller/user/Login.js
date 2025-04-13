const User = require("../../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Login function
const Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "All the fields must be filled." });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                field: "email",
                message: "This email is not registered. Please sign up first."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
              success: false,
              field: "password", // Add this
              error: "Incorrect password. Please try again." // More user-friendly
            });
          }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Google OAuth: Passport Authentication
const googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });

// Google OAuth Callback
const googleCallback = passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
});

// Google OAuth Success Handler
const googleSuccess = (req, res) => {
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


module.exports = { Login, googleLogin, googleCallback, googleSuccess };