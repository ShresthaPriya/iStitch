const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Ensure mongoose is imported
const { getOrders, addOrder, updateOrder, deleteOrder } = require("../controller/order/orderController");
const OrderModel = require('../models/OrderSchema'); // Correct import

router.get('/', getOrders);
router.post('/', addOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

// Save a new order
router.post('/', async (req, res) => {
    const { customer, userId, items, total, totalAmount, paymentMethod, status, fullName, contactNumber, address, isCustomOrder } = req.body;

    // Log the received payload for debugging
    console.log("Received Order Payload:", req.body);

    // Validate required fields - support both customer and userId
    const customerId = customer || userId;
    const orderTotal = totalAmount || total;

    if (!customerId || !items || !orderTotal || !paymentMethod || !status || !fullName || !contactNumber || !address) {
        console.error("Missing required fields:", { customerId, items, orderTotal, paymentMethod, status, fullName, contactNumber, address });
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
        console.error("Invalid items array:", items);
        return res.status(400).json({ success: false, message: "Items array is invalid or empty" });
    }

    try {
        console.log("Attempting to save order to the database...");
        const newOrder = new OrderModel({
            userId: customerId,
            customer: customerId,
            items: items,
            total: orderTotal,
            totalAmount: orderTotal,
            paymentMethod,
            status,
            fullName,
            contactNumber,
            address,
            isCustomOrder: isCustomOrder || false
        });
        
        await newOrder.save();
        console.log("Order saved successfully:", newOrder);
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
        console.log(`Fetching orders for user ID: ${userId}`);
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }

        const orders = await OrderModel.find({ 
            $or: [
                { userId: new mongoose.Types.ObjectId(userId) }, // Correct usage of ObjectId
                { customer: new mongoose.Types.ObjectId(userId) }
            ]
        }).sort({ createdAt: -1 }).lean();

        console.log(`Found ${orders.length} orders for user ${userId}`);
        
        return res.json({ 
            success: true, 
            orders,
            count: orders.length
        });
    } catch (err) {
        console.error("Error retrieving orders:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve orders",
            error: err.message 
        });
    }
});

module.exports = router;
