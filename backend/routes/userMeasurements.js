const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserMeasurement = require('../models/UserMeasurement');
const ShirtMeasurements = require('../models/ShirtMeasurements');
const PantMeasurements = require('../models/PantMeasurements');
const BlazerMeasurements = require('../models/BlazerMeasurements');
const BlouseMeasurements = require('../models/BlouseMeasurements');

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

// Get all measurements for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`Fetching measurements for user ID: ${userId}`);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Convert string userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch all types of measurements for this user
        const [shirts, pants, blazers, blouses] = await Promise.all([
            ShirtMeasurements.find({ user: userObjectId }).lean(),
            PantMeasurements.find({ user: userObjectId }).lean(),
            BlazerMeasurements.find({ user: userObjectId }).lean(),
            BlouseMeasurements.find({ user: userObjectId }).lean()
        ]);

        // Add type information to each measurement
        const typedShirts = shirts.map(shirt => ({ ...shirt, type: 'Shirt' }));
        const typedPants = pants.map(pant => ({ ...pant, type: 'Pant' }));
        const typedBlazers = blazers.map(blazer => ({ ...blazer, type: 'Blazer' }));
        const typedBlouses = blouses.map(blouse => ({ ...blouse, type: 'Blouse' }));

        // Combine all measurements
        const allMeasurements = [
            ...typedShirts, 
            ...typedPants, 
            ...typedBlazers, 
            ...typedBlouses
        ];

        console.log(`Found ${allMeasurements.length} measurements for user ${userId}`);

        return res.json({
            success: true,
            measurements: allMeasurements,
            count: allMeasurements.length
        });
    } catch (err) {
        console.error(`Error retrieving measurements: ${err.message}`);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve measurements",
            error: err.message
        });
    }
});

module.exports = router;
