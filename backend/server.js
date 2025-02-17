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
const subcategoryRoutes = require("./routes/subcategoryRoute");
const itemRoutes = require("./routes/itemRoute");
const fabricRoutes = require("./routes/fabricRoute");
const measurementRoutes = require("./routes/measurementRoute");
const guideRoutes = require("./routes/guideRoute");
const metricsRoutes = require("./routes/metricsRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Image upload middleware
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", verifyToken, Home.Home);
app.use("/register", Register);
app.use("/login", Login);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/fabrics", fabricRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/metrics", metricsRoutes);

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
