const mongoose = require("mongoose");

// Clear Mongoose cache in development to prevent OverwriteModelError
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.User;
    delete mongoose.modelSchemas.User;
}

const UserSchema = new mongoose.Schema({
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
        required: function () {
            // Password is required only if the user is not created via Google OAuth
            return !this.googleId;
        },
        default: null
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }, 
    acceptedTerms: { type: Boolean, default: false },  // New field to track terms acceptance

},
    { timestamps: true }
);

// Use existing model if it exists, otherwise define a new one
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);