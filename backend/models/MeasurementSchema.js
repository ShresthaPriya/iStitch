const mongoose = require("mongoose");

const MeasurementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Measurement", MeasurementSchema);
