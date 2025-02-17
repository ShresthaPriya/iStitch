const mongoose = require("mongoose");

const GuideSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    video: {
        type: String
    },
    guideFile: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Guide", GuideSchema);
