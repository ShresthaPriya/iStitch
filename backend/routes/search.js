const express = require("express");
const router = express.Router();
const Fabric = require("../models/FabricSchema");
const Item = require("../models/ItemSchema");

// Search for fabrics and items
router.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
    }

    try {
        const fabricResults = await Fabric.find({
            name: { $regex: query, $options: "i" }
        });

        const itemResults = await Item.find({
            name: { $regex: query, $options: "i" }
        });

        const results = {
            fabrics: fabricResults,
            items: itemResults
        };

        if (!fabricResults.length && !itemResults.length) {
            return res.status(404).json({ success: false, message: "No matching fabrics or items found" });
        }

        res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
