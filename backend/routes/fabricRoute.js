const express = require("express");
const router = express.Router();
const { getFabrics, addFabric, updateFabric, deleteFabric, upload } = require("../controller/fabric/fabricController");

router.get('/', getFabrics);
router.post("/", upload, addFabric); // Upload route for adding recipes
router.put('/:id', upload, updateFabric);
router.delete('/:id', deleteFabric);

module.exports = router;
