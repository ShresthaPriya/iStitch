const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const passport = require("passport");
const session = require("express-session");

const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();


const verifyToken = require("./middleware/Middleware");
const Home = require("./controller/user/Controller");
const Register = require("./routes/Register");
const Login = require("./routes/Login");
const authRoutes = require("./routes/authRoutes");
//Import DB function
const connectDB = require('./config/dbConnect');
const PORT = process.env.PORT || 3000;


//Middleware to parse json
app.use(express.json());
app.use(cors());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
router.get("/", verifyToken, Home.Home);
app.use("/register", Register);
app.use("/login", Login)
app.use("/auth", authRoutes);

const startServer = async()=>{
    try{
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Server starting on port ${PORT}`);
        });
    }catch(err){
      console.log(err);
      process.exit(1);
    }
};

startServer();