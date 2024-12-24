const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();


const verifyToken = require("./middleware/Middleware");
const Home = require("./controller/user/Controller");
const Register = require("./routes/Register");


//Import DB function
const connectDB = require('./config/dbConnect');
const PORT = process.env.PORT || 3000;


//Middleware to parse json
app.use(express.json());
app.use(cors());



router.get("/", verifyToken, Home.Home);
app.use("/register", Register);

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