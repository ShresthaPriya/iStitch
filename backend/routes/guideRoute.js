const express = require("express");
const router = express.Router();
const { getGuides, addGuide, updateGuide, deleteGuide } = require("../controller/guide/guideController");

router.get('/', getGuides);
router.post('/', addGuide);
router.put('/:id', updateGuide);
router.delete('/:id', deleteGuide);

module.exports = router;
