const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/Item');
const Category = require('../models/Category');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Fetch all items route
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find(); // Fetch all items
        res.json({ success: true, items }); // Include success flag
    } catch (err) {
        console.error("Error fetching items:", err); // Add logging
        res.json({ success: false, message: err.message });
    }
});

router.get('/items/category/:categoryName', async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.params.categoryName });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Fetch items with the found category _id
        const items = await Item.find({ category: category._id }).populate('category');

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new item with image upload
router.post('/items', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const newItem = new Item({
            name,
            description,
            price,
            category,
            images: [req.file.filename] // Save the uploaded image filename
        });
        await newItem.save();
        res.json({ success: true, item: newItem });
    } catch (err) {
        console.error("Error adding item:", err);
        res.json({ success: false, message: err.message });
    }
});

module.exports = router;
