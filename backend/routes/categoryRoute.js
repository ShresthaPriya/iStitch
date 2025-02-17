const express = require("express");
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require("../controller/category/categoryController");

router.get('/', getCategories);
router.post('/', addCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
