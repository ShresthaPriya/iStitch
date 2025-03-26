const express = require("express");
const dotenv = require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/dbConnect");
const configureGoogleStrategy = require("./config/passwordGoogle");
const verifyToken = require("./middleware/Middleware");
const Home = require("./controller/user/Controller");
const Register = require("./routes/Register");
const Login = require("./routes/Login");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoute");
const categoryRoutes = require("./routes/categoryRoute");
const orderRoutes = require("./routes/orderRoute");
const itemRoutes = require("./routes/itemRoutes");
const fabricRoutes = require("./routes/fabricRoute");
const measurementRoutes = require("./routes/measurementRoute");
const guideRoutes = require("./routes/guideRoute");
const metricsRoutes = require("./routes/metricsRoute");
const designRoutes = require("./routes/designRoute");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

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
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/fabrics", fabricRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/users", userRoutes);
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
