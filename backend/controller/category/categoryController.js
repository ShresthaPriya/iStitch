const Category = require("../../models/CategorySchema");

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate("subcategories");
        res.status(200).json({ success: true, categories });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new category
const addCategory = async (req, res) => {
    const { name, gender, subcategories } = req.body;
    if (!name || !gender) {
        return res.status(400).json({ success: false, error: "Name and gender are required" });
    }
    try {
        const newCategory = new Category({ name, gender, subcategories });
        await newCategory.save();
        res.status(201).json({ success: true, category: newCategory });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, gender, subcategories } = req.body;
    if (!name || !gender) {
        return res.status(400).json({ success: false, error: "Name and gender are required" });
    }
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, gender, subcategories }, { new: true });
        res.status(200).json({ success: true, category: updatedCategory });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };
