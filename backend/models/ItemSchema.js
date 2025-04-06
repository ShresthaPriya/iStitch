const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false // Make this field optional
    },
    price: {
        type: Number,
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
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 3;
}

module.exports = mongoose.model("Item", ItemSchema);
