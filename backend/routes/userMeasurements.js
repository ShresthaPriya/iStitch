const express = require('express');
const router = express.Router();
const UserMeasurement = require('../models/UserMeasurement');

// Save or update user measurements
router.post('/', async (req, res) => {
    const { userId, measurements } = req.body;

    try {
        console.log("Received measurements payload:", req.body);

        // Validate incoming data
        if (!userId || !Array.isArray(measurements)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid data format. userId and measurements array are required." 
            });
        }

        // Ensure each measurement has title, value, and unit
        const isValid = measurements.every(measurement =>
            measurement.title && 
            typeof measurement.value === 'number' && 
            measurement.unit
        );

        if (!isValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Each measurement must have title, numeric value, and unit" 
            });
        }

        // Check if measurements for user already exist
        let userMeasurement = await UserMeasurement.findOne({ userId });

        if (userMeasurement) {
            // Update existing measurements
            userMeasurement.measurements = measurements;
            await userMeasurement.save();
            console.log("Updated measurements:", userMeasurement);
        } else {
            // Create new measurements document
            userMeasurement = new UserMeasurement({ 
                userId, 
                measurements 
            });
            await userMeasurement.save();
            console.log("Created new measurements:", userMeasurement);
        }

        res.json({ 
            success: true, 
            message: "Measurements saved successfully",
            measurements: userMeasurement.measurements 
        });
    } catch (err) {
        console.error("Error saving measurements:", err);
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
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
