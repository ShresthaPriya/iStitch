const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();

//Import DB function
const connectDB = require('./config/dbConnect');
const PORT = process.env.PORT || 3000;


//Middleware to parse json
app.use(express.json());
app.use(cors());

const startServer = async()=>{
    try{
        await connectDB();
        app.listem(PORT, ()=>{
            console.log(`Server starting on port ${PORT}`);
        });
    }catch(err){
      console.log(err);
      process.exit(1);
    }
};

startServer();