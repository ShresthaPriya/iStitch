const express = require("express");
const dotenv = require("dotenv").config();
const passport = require("passport");
const session = require("express-session"); // ✅ use express-session instead of cookie-session
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/dbConnect");
const configureGoogleStrategy = require("./config/passwordGoogle");
const verifyToken = require("./middleware/Middleware");
const Home = require("./controller/user/Controller");
const Register = require("./routes/Register");
const Login = require("./routes/Login");
const authRoutes = require('./routes/authRoutes');
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
const cartRoutes = require("./routes/cart");
const userMeasurementsRoutes = require("./routes/userMeasurements");
const khaltiRoutes = require('./routes/khaltiRoutes.js');
const searchRoute = require("./routes/search.js");

// Add email test route
const emailTestRoutes = require('./routes/emailTest');
const adminAuth = require('./middleware/adminAuth');

// Import controllers
const { adminLogin } = require('./controller/user/adminAuth');

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL.replace(/\/+$/, ""); // Remove trailing slashes

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ Session middleware (replaces cookie-session)
app.use(
  session({
    secret: process.env.COOKIE_KEY || "cyberwolve",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
      secure: false, // Set to true in production with HTTPS
    },
  })
);

// Passport setup
configureGoogleStrategy();
app.use(passport.initialize());
app.use(passport.session());

// Use CLIENT_URL wherever needed
app.use((req, res, next) => {
  res.locals.CLIENT_URL = CLIENT_URL;
  next();
});

// Routes
app.get("/", verifyToken, Home.Home);
app.use("/register", Register);
app.use("/login", Login);
app.use('/auth', authRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

// Register additional alias routes for direct access
app.post("/auth/admin-login", require("./controller/admin/adminAuthController").adminLogin);
app.post("/api/auth/admin-login", require("./controller/admin/adminAuthController").adminLogin);

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
app.use("/api/cart", cartRoutes);
app.use("/api/user-measurements", userMeasurementsRoutes);
app.use('/api/khalti', khaltiRoutes);
app.use("/api", searchRoute);
app.use('/api/email', emailTestRoutes);

// Protect admin routes (do NOT protect the login endpoint)
app.use('/api/admin/*', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/login') {
    // Allow POST /api/admin/login without auth
    return next();
  }
  adminAuth(req, res, next);
});

// If you're using admin middleware, apply it correctly
app.use('/api/orders/:id', adminAuth);

// Or exclude it from specific routes
app.use('/api/orders', (req, res, next) => {
  // Skip auth for GET requests if needed
  if (req.method === 'GET' && !req.path.includes('/admin')) {
    return next();
  }
  // Apply auth middleware for other routes
  adminAuth(req, res, next);
});

// Debug registered routes
// app._router.stack.forEach(function(r){
//   if (r.route && r.route.path){
//     console.log(r.route.stack[0].method.toUpperCase() + ' ' + r.route.path)
//   } else if (r.name === 'router' && r.handle.stack) {
//     r.handle.stack.forEach(function(layer) {
//       if (layer.route) {
//         console.log('  ' + layer.route.stack[0].method.toUpperCase() + ' ' + r.regexp.toString().split('\\')[1].replace('\\/?(?=\\/|$)', '') + layer.route.path);
//       }
//     });
//   }
// });

// Log important configuration values at startup
// console.log('===== Server Configuration =====');
// console.log('Port:', process.env.PORT);
// console.log('Email User:', process.env.EMAIL_USER ? 'Set' : 'Not set');
// console.log('Email Password:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');
// console.log('Admin Email:', process.env.ADMIN_EMAIL || 'Not set');
// console.log('==============================');

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      
      // Log all registered routes
      // console.log('API Routes:');
      // const getRoutes = (stack, basePath = '') => {
      //   stack.forEach(layer => {
      //     if (layer.route) {
      //       const methods = Object.keys(layer.route.methods)
      //         .filter(method => layer.route.methods[method])
      //         .map(method => method.toUpperCase());
      //       console.log(`${methods} ${basePath}${layer.route.path}`);
      //     } else if (layer.name === 'router' && layer.handle.stack) {
      //       const newBasePath = basePath + (layer.regexp.toString().match(/^\/\^\\\/([^\\]+)/) ? '/' + layer.regexp.toString().match(/^\/\^\\\/([^\\]+)/)[1] : '');
      //       getRoutes(layer.handle.stack, newBasePath);
      //     }
      //   });
      // };
      
      // getRoutes(app._router.stack);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
