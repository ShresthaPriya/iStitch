const Order = require('../models/OrderSchema');

const addOrder = async (req, res) => {
    try {
        let { userId, items, total, totalAmount, fullName, address, contactNumber, paymentMethod, status } = req.body;

        // Ensure items is an array of objects
        if (typeof items === 'string') {
            items = JSON.parse(items);
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: "Items must be a non-empty array" });
        }

        // Ensure totalAmount is explicitly set
        if (!totalAmount) {
            totalAmount = total; // Fallback to total if totalAmount is not provided
        }

        // Check for duplicate orders (e.g., same userId, totalAmount, and status)
        const existingOrder = await Order.findOne({
            userId,
            totalAmount,
            status: "Pending", // Check for pending orders to avoid duplicates
            createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Within the last 5 minutes
        });

        if (existingOrder) {
            return res.status(400).json({ success: false, error: "Duplicate order detected. Please wait before placing another order." });
        }

        const newOrder = new Order({
            userId,
            items,
            totalAmount, // Explicitly include totalAmount
            fullName,
            address,
            contactNumber,
            paymentMethod,
            status
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { addOrder };
