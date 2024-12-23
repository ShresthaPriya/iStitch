const User = require("../models/UserSchema"); // Ensure you're using the correct model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//add credentials in registration
const addCredentials = async (req, res)=>{
    const {fullname, email, password, confirmPassword} = req.body;
    if (!fullname || !email ||!password || !confirmPassword){
        return res.status(404).json({success:false, error:"All fields must be field"});

    }
    try{
        const existsUser = await User.findOne({ email});
    if (existsUser){
        return res.status(400).json({success:false, error: "Email already exists."});
    }    
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({ 
        username, 
        email, 
        password: hashedPassword, // Save the hashed password
        role // Save the role
    });

    // Exclude password from the response
    newUser.password = undefined;
    return res.status(201).json({ success: true, user: newUser });
} catch (err) {
    res.status(500).json({ success: false, error: err.message });

}

};

module.exports = { addCredentials };


