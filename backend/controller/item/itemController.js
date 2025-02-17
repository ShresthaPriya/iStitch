const Item = require("../../models/ItemSchema");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../public/images");
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

// Get all items
const getItems = async (req, res) => {
    try {
        const items = await Item.find().populate("subcategory");
        res.status(200).json({ success: true, items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new item
const addItem = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading images:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const { name, subcategory, price, description } = req.body;
        if (!name || !subcategory || !price || !description) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const images = req.files.map(file => file.path);

        try {
            const newItem = new Item({ name, subcategory, price, description, images });
            await newItem.save();
            res.status(201).json({ success: true, item: newItem });
        } catch (err) {
            console.error("Error adding item:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });
};

// Update an item
const updateItem = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading images:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const { id } = req.params;
        const { name, subcategory, price, description } = req.body;
        if (!name || !subcategory || !price || !description) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const images = req.files.map(file => file.path);

        try {
            const updatedItem = await Item.findByIdAndUpdate(id, { name, subcategory, price, description, images }, { new: true });
            res.status(200).json({ success: true, item: updatedItem });
        } catch (err) {
            console.error("Error updating item:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });
};

// Delete an item
const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
