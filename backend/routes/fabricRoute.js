const express = require("express");
const router = express.Router();
const { getFabrics, getFabricById, addFabric, updateFabric, deleteFabric, upload } = require("../controller/fabric/fabricController");

router.get('/', getFabrics);
router.get('/:id', getFabricById);
router.post("/", upload, addFabric);
router.put('/:id', upload, updateFabric);
router.delete('/:id', deleteFabric);

module.exports = router;
