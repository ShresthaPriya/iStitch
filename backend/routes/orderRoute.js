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
    const { userId, items, total, paymentMethod, status, khaltiPayload } = req.body;

    try {
        const newOrder = new Order({
            userId,
            items,
            total,
            paymentMethod,
            status,
            khaltiPayload
        });
        await newOrder.save();
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
