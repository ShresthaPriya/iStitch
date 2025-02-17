const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Men", "Women"]
    },
    items: {
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
