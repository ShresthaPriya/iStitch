const mongoose = require('mongoose');

// Check if the model already exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
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
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}));

<<<<<<< Updated upstream
module.exports = User;
=======
module.exports = User;
>>>>>>> Stashed changes
