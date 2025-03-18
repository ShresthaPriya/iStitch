const mongoose = require("mongoose");

const UserMeasurementSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    measurements: {
        type: Map,
        of: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("UserMeasurement", UserMeasurementSchema);
