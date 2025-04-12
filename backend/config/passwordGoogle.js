const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/UserSchema");

const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true, // Pass the request object to the callback
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const action = req.query.state; // Get the action (signup or login) from the state parameter

          // Check if user exists in the database
          const existingUser = await User.findOne({ googleId: profile.id });

          if (action === "signup") {
            if (existingUser) {
              return done(null, false, { message: "User already exists. Please log in instead." });
            }

            // Create a new user for sign-up
            const newUser = await User.create({
              googleId: profile.id,
              fullname: profile.displayName,
              email: profile.emails[0].value,
            });

            return done(null, newUser);
          }

          if (action === "login") {
            if (existingUser) {
              return done(null, existingUser); // Log in the user
            }

            return done(null, false, { message: "Please sign up with Google first." });
          }

          return done(null, false, { message: "Invalid action." });
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = configureGoogleStrategy;
