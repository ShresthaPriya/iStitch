const express = require("express");
const { saveUserMeasurements } = require("../controller/userMeasurementController");

const router = express.Router();

router.post("/", saveUserMeasurements);

module.exports = router;
