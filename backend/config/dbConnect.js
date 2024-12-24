const mongoose = require("mongoose");
//asynchronous function for handling database connection:MongoDB
async function connectDB(){
  try{
    const connectionInstallation = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to database: ${connectionInstallation.connection.host}`);
  }catch(err){
   console.error(`Error: ${err.message}`);
   process.exit(1);
  }
}
module.exports = connectDB;