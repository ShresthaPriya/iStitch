const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
}, { timestamps: true });

// Use mongoose.models to check if the model is already defined
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
