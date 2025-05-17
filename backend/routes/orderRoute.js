const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Ensure mongoose is imported
const OrderModel = require('../models/OrderSchema'); // Correct import
const { sendEmail, generateOrderConfirmationEmail, generateAdminOrderNotificationEmail } = require('../utils/emailService');
const User = require('../models/User'); // Make sure this path is correct

// Instead of directly requiring Item, use this pattern:
let Item;
try {
    Item = mongoose.model('Item');
} catch (error) {
    Item = require('../models/ItemSchema');
}

// POST route for creating a new order
router.post('/', async (req, res) => {
    const { userId, customer, items, totalAmount, paymentMethod, status, fullName, contactNumber, address, paymentToken } = req.body;

    // Log the received payload for debugging
    console.log("Received Order Payload:", req.body);

    // Calculate total from totalAmount if total is missing
    const total = req.body.total || totalAmount;

    // Validate required fields
    if (!userId || !customer || !items || !total || !totalAmount || !paymentMethod || !status || !fullName || !contactNumber || !address) {
        console.error("Missing required fields:", { userId, customer, items, total, totalAmount, paymentMethod, status, fullName, contactNumber, address });
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
            userId,
            customer,
            items,
            total,         // Include total from calculation above
            totalAmount,
            paymentMethod,
            status,
            fullName,
            contactNumber,
            address,
            paymentToken
        });
        
        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder);
        
        // Send order confirmation email with product details
        try {
            const enhancedOrder = JSON.parse(JSON.stringify(savedOrder));
            
            // Load product details for each item
            for (let i = 0; i < enhancedOrder.items.length; i++) {
                const item = enhancedOrder.items[i];
                if (item.productId) {
                    try {
                        const productId = typeof item.productId === 'object' ? 
                            item.productId._id : item.productId;
                        
                        const product = await Item.findById(productId);
                        if (product) {
                            enhancedOrder.items[i].productName = product.name;
                            console.log(`Found product name: ${product.name} for item ${i}`);
                        }
                    } catch (err) {
                        console.error(`Error fetching product details for item ${i}:`, err);
                    }
                }
            }
            
            // Find the user to get their email
            const userId = enhancedOrder.userId || enhancedOrder.customer;
            console.log("Fetching user with ID:", userId);
            
            const user = await User.findById(userId);
            
            if (user && user.email) {
                console.log("Found user with email:", user.email);
                
                // Send customer confirmation email with enhanced order
                const emailContent = generateOrderConfirmationEmail(enhancedOrder);
                const emailResult = await sendEmail(
                    user.email,
                    `iStitch Order Confirmation #${enhancedOrder._id.toString().slice(-6)}`,
                    emailContent
                );
                
                console.log("Customer email result:", emailResult);
                
                // Send admin notification with enhanced order
                const adminEmail = process.env.ADMIN_EMAIL;
                console.log("Sending admin notification to:", adminEmail);
                
                const adminNotificationContent = generateAdminOrderNotificationEmail(enhancedOrder);
                const adminResult = await sendEmail(
                    adminEmail,
                    `New Order Notification #${enhancedOrder._id.toString().slice(-6)}`,
                    adminNotificationContent
                );
                
                console.log("Admin notification result:", adminResult);
            } else {
                console.warn("⚠️ No email found for user:", userId);
            }
        } catch (emailError) {
            console.error("Error sending order emails:", emailError);
        }
        
        res.json({ success: true, message: "Order created successfully", order: savedOrder });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ success: false, message: "Failed to create order", error: err.message });
    }
});

// Get orders by userId
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const orders = await require('../models/OrderSchema').find({
            $or: [
                { userId: new mongoose.Types.ObjectId(userId) },
                { customer: new mongoose.Types.ObjectId(userId) }
            ]
        }).sort({ createdAt: -1 }).lean();

        return res.json({ success: true, orders, count: orders.length });
    } catch (err) {
        console.error("Error retrieving orders:", err);
        return res.status(500).json({ success: false, message: "Failed to retrieve orders", error: err.message });
    }
});
module.exports = router;
