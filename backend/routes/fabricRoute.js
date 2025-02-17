const express = require("express");
const router = express.Router();
const { getFabrics, addFabric, updateFabric, deleteFabric } = require("../controller/fabric/fabricController");

router.get('/', getFabrics);
router.post('/', addFabric);
router.put('/:id', updateFabric);
router.delete('/:id', deleteFabric);

module.exports = router;
