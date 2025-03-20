const Item = require("../../models/ItemSchema");
const multer = require("multer");
// const fs = require("fs");
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

// Get all items
const getItems = async (req, res) => {
    try {
        const items = await Item.find().populate("category");
        res.status(200).json({ success: true, items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get items by category
const getItemsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const items = await Item.find({ category }).populate("category");
        res.status(200).json({ success: true, items });
    } catch (err) {
        console.error("Error fetching items by category:", err);
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

        const { name, category, price, description } = req.body;
        if (!name || !category || !price || !description) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const images = req.files.map(file => file.filename);

        try {
            const newItem = new Item({ name, category, price, description, images });
            await newItem.save();
            res.status(201).json({ success: true, item: newItem });
        } catch (err) {
            console.error("Error adding item:", err);
            console.error("Request body:", req.body);
            console.error("Uploaded files:", req.files);
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
        const { name, category, price, description } = req.body;
        if (!name || !category || !price || !description) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const images = req.files.map(file => file.filename);

        try {
            const updatedItem = await Item.findByIdAndUpdate(id, { name, category, price, description, images }, { new: true });
            res.status(200).json({ success: true, item: updatedItem });
        } catch (err) {
            console.error("Error updating item:", err);
            console.error("Request body:", req.body);
            console.error("Uploaded files:", req.files);
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

module.exports = { getItems, addItem, updateItem, deleteItem, getItemsByCategory, upload };

