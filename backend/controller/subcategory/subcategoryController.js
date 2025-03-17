// const Subcategory = require("../../models/SubcategorySchema");

// // Get all subcategories
// const getSubcategories = async (req, res) => {
//     try {
//         const subcategories = await Subcategory.find().populate("category");
//         res.status(200).json({ success: true, subcategories });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // Add a new subcategory
// const addSubcategory = async (req, res) => {
//     const { name, category } = req.body;
//     if (!name || !category) {
//         return res.status(400).json({ success: false, error: "All fields are required" });
//     }
//     try {
//         const newSubcategory = new Subcategory({ name, category });
//         await newSubcategory.save();
//         res.status(201).json({ success: true, subcategory: newSubcategory });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // Update a subcategory
// const updateSubcategory = async (req, res) => {
//     const { id } = req.params;
//     const { name, category } = req.body;
//     if (!name || !category) {
//         return res.status(400).json({ success: false, error: "All fields are required" });
//     }
//     try {
//         const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, { name, category }, { new: true });
//         res.status(200).json({ success: true, subcategory: updatedSubcategory });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // Delete a subcategory
// const deleteSubcategory = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await Subcategory.findByIdAndDelete(id);
//         res.status(200).json({ success: true, message: "Subcategory deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// module.exports = { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory };
