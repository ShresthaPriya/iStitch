const express = require("express");
const router = express.Router();
const { getOrders, addOrder, updateOrder, deleteOrder } = require("../controller/order/orderController");
const Order = require('../models/Order');

router.get('/', getOrders);
router.post('/', addOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

// Save a new order
router.post('/', async (req, res) => {
    const { userId, items, total, paymentMethod, status, fullName, contactNumber, address } = req.body;

    // Log the received payload for debugging
    console.log("Received Order Payload:", req.body);

    // Validate required fields
    if (!userId || !items || !total || !paymentMethod || !status || !fullName || !contactNumber || !address) {
        console.error("Missing required fields:", { userId, items, total, paymentMethod, status, fullName, contactNumber, address });
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
        console.error("Invalid items array:", items);
        return res.status(400).json({ success: false, message: "Items array is invalid or empty" });
    }

    // Validate each item in the items array
    for (const item of items) {
        if (!item.productId || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
            console.error("Invalid item in items array:", item);
            return res.status(400).json({ success: false, message: "Each item must have productId, quantity, and price" });
        }
    }

    try {
        console.log("Attempting to save order to the database...");
        const newOrder = new Order({
            userId,
            items,
            total,
            paymentMethod,
            status,
            fullName,
            contactNumber,
            address
        });
        await newOrder.save();
        console.log("Order saved successfully:", newOrder); // Log the saved order
        res.json({ success: true, order: newOrder });
    } catch (err) {
        console.error("Error saving order:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Retrieve orders for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        console.error("Error retrieving orders:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
