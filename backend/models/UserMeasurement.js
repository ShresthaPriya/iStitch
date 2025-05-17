const mongoose = require('mongoose');

const UserMeasurementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    measurements: [
        {
            title: { type: String, required: true },
            value: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('UserMeasurement', UserMeasurementSchema);
