const Order = require('../models/OrderSchema');

const addOrder = async (req, res) => {
    try {
        let { userId, items, total, fullName, address, contactNumber, paymentMethod, status } = req.body;

        // Ensure items is an array of objects
        if (typeof items === 'string') {
            items = JSON.parse(items);
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: "Items must be a non-empty array" });
        }

        const newOrder = new Order({
            userId,
            items,
            total,
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
