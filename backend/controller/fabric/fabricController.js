const Fabric = require("../../models/FabricSchema");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images')); // Corrected path
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        console.log('Saving file as:', filename); // Logging filename
        cb(null, filename);
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
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const images = req.files.map(file => file.filename); // Store only the filename

    try {
        const newFabric = new Fabric({ name, description, images, price });
        await newFabric.save();
        res.status(201).json({ success: true, fabric: newFabric });
    } catch (err) {
        console.error("Error adding fabric:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update a fabric
const updateFabric = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const images = req.files.map(file => file.filename); // Store only the filename

    try {
        const updatedFabric = await Fabric.findByIdAndUpdate(id, { name, description, images, price }, { new: true });
        res.status(200).json({ success: true, fabric: updatedFabric });
    } catch (err) {
        console.error("Error updating fabric:", err);
        res.status(500).json({ success: false, error: err.message });
    }
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

module.exports = { getFabrics, addFabric, updateFabric, deleteFabric, upload };
