const Fabric = require("../../models/FabricSchema");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).array('images', 3);

// Get all fabrics
const getFabrics = async (req, res) => {
    try {
        const fabrics = await Fabric.find();
        res.status(200).json({ success: true, fabrics });
    } catch (err) {
        console.error("Error fetching fabrics:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new fabric
const addFabric = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading images:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const images = req.files.map(file => file.path);

        try {
            const newFabric = new Fabric({ name, description, images });
            await newFabric.save();
            res.status(201).json({ success: true, fabric: newFabric });
        } catch (err) {
            console.error("Error adding fabric:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });
};

// Update a fabric
const updateFabric = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading images:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const images = req.files.map(file => file.path);

        try {
            const updatedFabric = await Fabric.findByIdAndUpdate(id, { name, description, images }, { new: true });
            res.status(200).json({ success: true, fabric: updatedFabric });
        } catch (err) {
            console.error("Error updating fabric:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });
};

// Delete a fabric
const deleteFabric = async (req, res) => {
    const { id } = req.params;
    try {
        await Fabric.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Fabric deleted successfully" });
    } catch (err) {
        console.error("Error deleting fabric:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getFabrics, addFabric, updateFabric, deleteFabric };
