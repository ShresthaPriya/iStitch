const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Category = require('../models/Category');

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

module.exports = router;
