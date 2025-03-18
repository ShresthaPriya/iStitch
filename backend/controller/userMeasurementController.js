const UserMeasurement = require("../models/UserMeasurementSchema");

// Save user measurements
const saveUserMeasurements = async (req, res) => {
    const { userId, measurements } = req.body;
    if (!userId || !measurements) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
        const newUserMeasurement = new UserMeasurement({ userId, measurements });
        await newUserMeasurement.save();
        res.status(201).json({ success: true, userMeasurement: newUserMeasurement });
    } catch (err) {
        console.error("Error saving user measurements:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { saveUserMeasurements };
