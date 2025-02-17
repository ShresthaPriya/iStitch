const express = require("express");
const router = express.Router();
const { getMetrics } = require("../controller/metrics/metricsController");

router.get('/', getMetrics);

module.exports = router;
