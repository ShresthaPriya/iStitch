const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory"
    }]
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
