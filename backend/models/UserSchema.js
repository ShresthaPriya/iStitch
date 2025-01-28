const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    googleId: { 
        type: String, 
        unique: true 
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }, 
},
    {timestamps:true}
);

module.exports = mongoose.model("User", UserSchema);