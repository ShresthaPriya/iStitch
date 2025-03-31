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
const orderRoutes = require("./routes/orderRoute"); // Import order routes
const itemRoutes = require("./routes/itemRoutes");
const fabricRoutes = require("./routes/fabricRoute");
const measurementRoutes = require("./routes/measurementRoute");
const guideRoutes = require("./routes/guideRoute");
const metricsRoutes = require("./routes/metricsRoute");
const designRoutes = require("./routes/designRoute");
const userRoutes = require("./routes/users"); // Import users route
const cartRoutes = require("./routes/cart"); // Import cart routes
const userMeasurementsRoutes = require("./routes/userMeasurements"); // Import userMeasurements route
const khaltiRoutes = require('./routes/khaltiRoutes'); // Add Khalti routes

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
app.use("/api/orders", orderRoutes); // Add order routes
app.use("/api/items", itemRoutes);
app.use("/api/fabrics", fabricRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/users", userRoutes); // Register users route
app.use("/api/cart", cartRoutes); // Add cart routes
app.use("/api/user-measurements", userMeasurementsRoutes); // Register userMeasurements route
app.use("/api/khalti", khaltiRoutes); // Register Khalti routes

// Start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to connect to DB:", err.message);
  process.exit(1);
});

