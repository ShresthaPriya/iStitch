const express = require('express');
const router = express.Router();
const axios = require('axios');
const OrderModel = require('../models/OrderSchema'); // Import the Order model
const { sendEmail, generateOrderConfirmationEmail, generateAdminOrderNotificationEmail } = require('../utils/emailService');
const User = require('../models/User'); // Make sure this path is correct
let Item;

try {
    Item = mongoose.model('Item');
} catch (error) {
    Item = require('../models/ItemSchema');
}

console.log("Khalti routes are being registered at:", new Date().toISOString());

// Environment variables - replace with your actual keys
const KHALTI_SECRET_KEY = "46dddb5ea6fe4862928b7e6714683551"; 
const KHALTI_GATEWAY_URL = "https://a.khalti.com";

// Helper functions for Khalti integration
async function initializeKhaltiPayment({
  return_url,
  website_url,
  amount,
  purchase_order_id,
  purchase_order_name,
  customer_info
}) {
  try {
    let headersList = {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      return_url,
      website_url,
      amount,
      purchase_order_id,
      purchase_order_name,
      customer_info
    });
    
    console.log("Request to Khalti:", bodyContent);
    
    let reqOptions = {
      url: `${KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Khalti Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

async function verifyKhaltiPayment(pidx) {
  try {
    let headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
    };

    let bodyContent = JSON.stringify({ pidx });

    let reqOptions = {
      url: `${KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Test route to ensure the router is working
router.get('/test', (req, res) => {
  console.log("Test endpoint hit");
  res.json({ success: true, message: "Khalti routes are working" });
});

// Khalti payment verification endpoint
router.post('/verify', async (req, res) => {
    console.log("Verify endpoint hit with data:", JSON.stringify(req.body, null, 2));
    try {
        const { pidx, orderPayload } = req.body;

        if (!pidx) {
            return res.status(400).json({
                success: false,
                message: "Payment ID (pidx) is required"
            });
        }

        // Check if an order with this payment token already exists
        const existingOrder = await OrderModel.findOne({ 
            $or: [
                { paymentToken: pidx },
                { "transaction.pidx": pidx }
            ]
        });
        
        if (existingOrder) {
            console.log("Order already exists for this payment:", existingOrder._id);
            return res.json({
                success: true,
                message: "Payment already processed",
                order: existingOrder
            });
        }

        // Verify the payment with Khalti
        const verificationResult = await verifyKhaltiPayment(pidx);
        console.log("Khalti verification response:", JSON.stringify(verificationResult, null, 2));

        if (verificationResult.status === 'Completed') {
            console.log("Payment verified successfully. Checking order payload...");

            // Validate order payload
            if (!orderPayload || !orderPayload.items || orderPayload.items.length === 0) {
                console.error("Invalid order payload - missing items:", JSON.stringify(orderPayload, null, 2));
                return res.status(400).json({
                    success: false,
                    message: "Invalid order data. Cart items are missing."
                });
            }

            if (!orderPayload.contactNumber || !orderPayload.address || orderPayload.address === "Not provided") {
                console.error("Invalid order payload - missing contact number or address:", JSON.stringify(orderPayload, null, 2));
                return res.status(400).json({
                    success: false,
                    message: "Invalid order data. Contact number or address is missing."
                });
            }

            try {
                console.log("Valid order payload. Saving order to database:", JSON.stringify(orderPayload, null, 2));

                // Add payment transaction details to ensure uniqueness
                const newOrder = new OrderModel({
                    userId: orderPayload.userId || orderPayload.customer,
                    customer: orderPayload.customer,
                    items: orderPayload.items.map(item => ({
                        ...item,
                        size: item.size || 'M'  // Add default size if not provided
                    })),
                    total: orderPayload.total || orderPayload.totalAmount,
                    totalAmount: orderPayload.totalAmount,
                    paymentMethod: "Khalti",
                    paymentToken: verificationResult.transaction_id || pidx,
                    transaction: {
                        id: verificationResult.transaction_id,
                        pidx: pidx,
                        amount: verificationResult.total_amount,
                        fee: verificationResult.fee || 0,
                        completed: true,
                        date: new Date()
                    },
                    paymentStatus: 'Paid',
                    status: "Processing",
                    fullName: orderPayload.fullName || "N/A",
                    contactNumber: orderPayload.contactNumber || "Not provided",
                    address: orderPayload.address || "Not provided",
                    isCustomOrder: orderPayload.isCustomOrder || false
                });

                console.log("About to save order with address:", orderPayload.address);
                const savedOrder = await newOrder.save();
                console.log("Khalti order saved successfully:", savedOrder);
                
                // Enhance order with product details for email
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
                    console.log("Fetching user for Khalti order. User ID:", userId);
                    
                    const user = await User.findById(userId);
                    
                    if (user && user.email) {
                        console.log("Found Khalti customer with email:", user.email);
                        
                        // Send customer confirmation with enhanced order data
                        const emailContent = generateOrderConfirmationEmail(enhancedOrder);
                        const emailResult = await sendEmail(
                            user.email,
                            `iStitch Order Confirmation #${enhancedOrder._id.toString().slice(-6)}`,
                            emailContent
                        );
                        
                        console.log("Khalti customer email result:", emailResult);
                        
                        // Send admin notification with enhanced order data
                        const adminEmail = process.env.ADMIN_EMAIL;
                        console.log("Sending Khalti admin notification to:", adminEmail);
                        
                        const adminNotificationContent = generateAdminOrderNotificationEmail(enhancedOrder);
                        const adminResult = await sendEmail(
                            adminEmail,
                            `New Khalti Order Notification #${enhancedOrder._id.toString().slice(-6)}`,
                            adminNotificationContent
                        );
                        
                        console.log("Khalti admin notification result:", adminResult);
                    } else {
                        console.warn("⚠️ No email found for Khalti user:", userId);
                    }
                } catch (emailError) {
                    console.error("Error sending Khalti order emails:", emailError);
                }
                
                return res.json({
                    success: true,
                    message: "Payment verified and order saved successfully",
                    order: savedOrder
                });
            } catch (orderErr) {
                // Handle potential duplicate key errors (race condition)
                if (orderErr.code === 11000) {
                    const duplicateOrder = await OrderModel.findOne({
                        $or: [
                            { paymentToken: verificationResult.transaction_id || pidx },
                            { "transaction.pidx": pidx }
                        ]
                    });
                    
                    if (duplicateOrder) {
                        console.log("Duplicate order found:", duplicateOrder._id);
                        return res.json({
                            success: true,
                            message: "Order already exists",
                            order: duplicateOrder
                        });
                    }
                }
                
                console.error("Error saving order:", orderErr);
                return res.status(500).json({
                    success: false,
                    message: "Payment verified but failed to save order",
                    error: orderErr.message
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
                data: verificationResult
            });
        }
    } catch (err) {
        console.error("Error verifying Khalti payment:", err);
        res.status(500).json({
            success: false,
            message: err.detail || "Payment verification failed",
            error: err
        });
    }
});

// Khalti payment initiation endpoint
router.post('/initiate', async (req, res) => {
    console.log("Initiate endpoint hit with body:", JSON.stringify(req.body, null, 2));
    try {
        const { amount, purchaseOrderId, purchaseOrderName, returnUrl } = req.body;

        if (!amount || !purchaseOrderId || !purchaseOrderName || !returnUrl) {
            console.log("Validation failed - missing required fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required (amount, purchaseOrderId, purchaseOrderName, returnUrl)"
            });
        }
        const paymentData = {
            return_url: returnUrl,
            website_url: "http://localhost:3000",
            amount: amount,
            purchase_order_id: purchaseOrderId,
            purchase_order_name: purchaseOrderName,
            customer_info: {
                name: "Test Customer",
                email: "test@example.com",
                phone: "9800000001"  // Test phone number from Khalti docs
            }
        };

        const response = await initializeKhaltiPayment(paymentData);
        console.log("Khalti API response:", JSON.stringify(response, null, 2));
        
        res.json({
            success: true,
            paymentUrl: response.payment_url,
            pidx: response.pidx
        });

    } catch (err) {
        console.error("Error initiating Khalti payment:", err);
        
        res.status(500).json({
            success: false,
            message: err.detail || "Payment initiation failed",
            error: err
        });
    }
});
module.exports = router;