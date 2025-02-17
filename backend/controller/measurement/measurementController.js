const Measurement = require("../../models/MeasurementSchema");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'video', maxCount: 1 },
    { name: 'guideFile', maxCount: 1 }
]);

// Get all measurements
const getMeasurements = async (req, res) => {
    try {
        const measurements = await Measurement.find();
        res.status(200).json({ success: true, measurements });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new measurement
const addMeasurement = async (req, res) => {
    const { title, unit } = req.body;
    if (!title || !unit) {
        return res.status(400).json({ success: false, error: "Title and unit are required" });
    }

    try {
        const newMeasurement = new Measurement({ title, unit });
        await newMeasurement.save();
        res.status(201).json({ success: true, measurement: newMeasurement });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update a measurement
const updateMeasurement = async (req, res) => {
    const { id } = req.params;
    const { title, unit } = req.body;
    if (!title || !unit) {
        return res.status(400).json({ success: false, error: "Title and unit are required" });
    }

    try {
        const updatedMeasurement = await Measurement.findByIdAndUpdate(id, { title, unit }, { new: true });
        res.status(200).json({ success: true, measurement: updatedMeasurement });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete a measurement
const deleteMeasurement = async (req, res) => {
    const { id } = req.params;
    try {
        await Measurement.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Measurement deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getMeasurements, addMeasurement, updateMeasurement, deleteMeasurement };
