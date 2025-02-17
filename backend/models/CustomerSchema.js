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
    }
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
