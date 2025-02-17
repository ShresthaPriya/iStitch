const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { getMeasurements, addMeasurement, updateMeasurement, deleteMeasurement } = require("../controller/measurement/measurementController");

router.get('/', getMeasurements);
router.post('/', upload.single('file'), addMeasurement);
router.put('/:id', upload.single('file'), updateMeasurement);
router.delete('/:id', deleteMeasurement);

module.exports = router;
