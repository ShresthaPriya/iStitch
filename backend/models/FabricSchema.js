const mongoose = require("mongoose");

const FabricSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of image URLs
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    },
    price: {
        type: Number,
        required: true
    },
    products: {
        type: [String], // Array of product IDs or names
        default: [] // Default to an empty array
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 3;
}

module.exports = mongoose.model("Fabric", FabricSchema);
