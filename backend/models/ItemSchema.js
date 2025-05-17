const mongoose = require("mongoose");

const arrayLimit = (val) => val.length <= 3;

const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
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
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    },
    sizeChart: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    }
}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);
