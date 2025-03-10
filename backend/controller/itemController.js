// const Item = require("../../models/ItemSchema");

// // Get items by category and subcategory
// const getItems = async (req, res) => {
//     const { category, subcategory } = req.query;
//     try {
//         const items = await Item.find({
//             category: category,
//             subcategory: subcategory
//         }).populate("category").populate("subcategory");
//         res.status(200).json({ success: true, items });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// module.exports = { getItems };
