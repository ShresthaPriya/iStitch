const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    order: {
        type: [String],
        required: true
    },
    profilePicture: { type: String },
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      hip: { type: Number },
      inseam: { type: Number }
    },
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
