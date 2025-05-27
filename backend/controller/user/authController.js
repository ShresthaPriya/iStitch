const passport = require("passport");

const loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

const loginFailed = (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login failure",
  });
};

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`);
    }
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(info.message)}`);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent("Login failed")}`);
      }
       // Redirect based on action
      if (action === "signup") {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(info.message)}`);
      } else {
        return res.redirect(`${process.env.CLIENT_URL}/home`);
      }
    });
      
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: true, message: "Logout failed" });
    }
    res.redirect(process.env.CLIENT_URL);
  });
};

module.exports = {
  loginSuccess,
  loginFailed,
  googleAuth,
  googleCallback,
  logout,
};
