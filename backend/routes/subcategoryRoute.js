const express = require("express");
const router = express.Router();
const { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } = require("../controller/subcategory/subcategoryController");

router.get('/', getSubcategories);
router.post('/', addSubcategory);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

module.exports = router;
