const express = require("express");
const dotenv = require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");

const connectDB = require("./config/dbConnect");
const configureGoogleStrategy = require("./config/passwordGoogle");
const verifyToken = require("./middleware/Middleware");
const Home = require("./controller/user/Controller");
const Register = require("./routes/Register");
const Login = require("./routes/Login");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Cookie-based session
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "cyberwolve"], // Secure keys
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    // sameSite: "strict", // Strict session handling
  })
);

// Initialize Passport and Google OAuth Strategy
configureGoogleStrategy();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", verifyToken, Home.Home);
app.use("/register", Register);
app.use("/login", Login);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api/customers", customerRoutes); 

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err.message);
    process.exit(1);
  }
};

startServer();
