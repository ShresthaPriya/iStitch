const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  profilePicture: { type: String },
  measurements: {
    chest: { type: Number },
    waist: { type: Number },
    hip: { type: Number },
    inseam: { type: Number }
  }
});

module.exports = mongoose.model('CustomerDetail', CustomerSchema);
