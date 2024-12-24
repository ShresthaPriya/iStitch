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
            return res.status(400).json({ success: false, error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid password." });
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

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Redirect to frontend or send the token
    res.status(200).json({
        success: true,
        message: "Google login successful!",
        token,
        user,
    });
};

// Google OAuth Strategy Configuration
const configureGoogleStrategy = () => {
    const GoogleStrategy = require("passport-google-oauth20").Strategy;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:4000/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user exists
                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {
                        // Create a new user if not found
                        user = await User.create({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                        });
                    }

                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = { Login, googleLogin, googleCallback, googleSuccess, configureGoogleStrategy };
