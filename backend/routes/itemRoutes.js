const express = require("express");
const { getItems, addItem, updateItem, deleteItem, getItemsByCategory, upload } = require("../controller/item/itemController");

const router = express.Router();

router.get("/", getItems);
router.post("/", upload, addItem);
router.put("/:id", upload, updateItem);
router.delete("/:id", deleteItem);
router.get("/category/:category", getItemsByCategory);

module.exports = router;
