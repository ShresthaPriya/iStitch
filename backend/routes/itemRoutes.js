// const express = require("express");
// const { getItems, getItemById, addItem, updateItem, deleteItem, getItemsByCategory, upload } = require("../controller/item/itemController");

// const router = express.Router();

// router.get("/", getItems);
// router.get("/:id", getItemById);
// router.post("/", upload, addItem);
// router.put("/:id", upload, updateItem);
// router.delete("/:id", deleteItem);
// router.get("/category/:category", getItemsByCategory);

// module.exports = router;


const express = require("express");
const { 
    getItems, 
    getItemById, 
    addItem, 
    updateItem, 
    deleteItem, 
    getItemsByCategory, 
    upload 
} = require("../controller/item/itemController");

const router = express.Router();

// Get all items
router.get("/", getItems);

// Get item by ID
router.get("/:id", getItemById);

// Get items by category
router.get("/category/:category", getItemsByCategory);

// Add a new item with file upload handling
router.post("/", (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        next();
    });
}, addItem);

// Update an item with file upload handling
router.put("/:id", (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        next();
    });
}, updateItem);

// Delete an item
router.delete("/:id", deleteItem);

module.exports = router;
