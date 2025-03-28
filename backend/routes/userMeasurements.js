const express = require('express');
const router = express.Router();
const UserMeasurement = require('../models/UserMeasurement');

// Save or update user measurements
router.post('/', async (req, res) => {
    const { userId, measurements } = req.body;

    try {
        // Validate incoming data
        if (!userId || !Array.isArray(measurements)) {
            return res.status(400).json({ success: false, message: "Invalid data format" });
        }

        // Ensure each measurement has title, value, and unit
        const isValid = measurements.every(measurement =>
            measurement.title && typeof measurement.value === 'number' && measurement.unit
        );

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid measurement data" });
        }

        let userMeasurement = await UserMeasurement.findOne({ userId });

        if (userMeasurement) {
            // Update existing measurements
            userMeasurement.measurements = measurements;
            await userMeasurement.save();
        } else {
            // Create new measurements
            userMeasurement = new UserMeasurement({ userId, measurements });
            await userMeasurement.save();
        }

        res.json({ success: true, measurements: userMeasurement.measurements });
    } catch (err) {
        console.error("Error saving measurements:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Retrieve user measurements
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userMeasurement = await UserMeasurement.findOne({ userId });
        if (userMeasurement) {
            res.json({ success: true, measurements: userMeasurement.measurements });
        } else {
            res.json({ success: true, measurements: [] }); // Return empty array if no measurements exist
        }
    } catch (err) {
        console.error("Error retrieving measurements:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
