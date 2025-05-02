const Order = require("../../models/OrderSchema");
// const { sendEmail } = require("../../utils/emailService");

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customer", "fullName contactNumber address")
            .populate("items.productId", "name price");

        res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new order
const addOrder = async (req, res) => {
    try {
        const {
            customer,
            userId,
            items,
            total,
            totalAmount,
            paymentMethod,
            status,
            fullName,
            contactNumber,
            address,
            isCustomOrder,
            orderId
        } = req.body;

        if (!items || items.length === 0 || !paymentMethod || !status || !fullName || !contactNumber || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        if (orderId) {
            const existingOrder = await Order.findOne({ orderId });
            if (existingOrder) {
                return res.status(400).json({ success: false, message: "Order already exists." });
            }
        }

        const generatedOrderId = orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const orderData = {
            userId: customer || userId,
            customer: customer || userId,
            items: isCustomOrder
                ? items.map(item => ({
                    ...item,
                    customDetails: item.customDetails || {}
                }))
                : items,
            totalAmount: totalAmount || total || 0,
            paymentMethod,
            status,
            fullName,
            contactNumber,
            address,
            isCustomOrder: isCustomOrder || false,
            orderId: generatedOrderId
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({ success: true, order: newOrder });

    } catch (err) {
        console.error("Error adding order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update order
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, ...otherFields } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status, ...otherFields }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Place order with email notification
// const placeOrder = async (req, res) => {
//     try {
//         const {
//             customer,
//             userId,
//             items,
//             totalAmount,
//             paymentMethod,
//             status,
//             fullName,
//             contactNumber,
//             address,
//             orderId
//         } = req.body;

//         // If payment is "Cash on Delivery", set the status as paid
//         const paymentStatus = paymentMethod === "Cash on Delivery" ? "paid" : status;

//         // Create the order and save it
//         const generatedOrderId = orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

//         const orderData = {
//             userId: customer || userId,
//             customer: customer || userId,
//             items,
//             totalAmount,
//             paymentMethod,
//             status: paymentStatus, // Ensure payment status is set properly
//             fullName,
//             contactNumber,
//             address,
//             orderId: generatedOrderId,
//         };

//         const savedOrder = await Order.create(orderData);

//         // Email content to send to the customer
//         const customerEmailContent = `
//             <h2>Hi ${fullName},</h2>
//             <p>Thank you for shopping with <strong>iStitch</strong>!</p>
//             <p>Your order has been placed successfully. Here are the details:</p>
//             <ul>
//                 <li><strong>Order ID:</strong> ${generatedOrderId}</li>
//                 <li><strong>Total Amount:</strong> Rs. ${totalAmount}</li>
//                 <li><strong>Payment Method:</strong> ${paymentMethod}</li>
//             </ul>
//             <p>We’ll notify you when it’s shipped.</p>
//             <br/>
//             <p>With love,</p>
//             <p>The iStitch Team</p>
//         `;

//         // Send order confirmation email to the customer
//         await sendEmail(customer.email, "Order Confirmation - iStitch", customerEmailContent);

//         // Admin email content to notify about the new order
//         const adminEmailContent = `
//             <h3>New Order Notification</h3>
//             <p><strong>Customer:</strong> ${fullName}</p>
//             <p><strong>Email:</strong> ${customer.email}</p>
//             <p><strong>Phone:</strong> ${contactNumber}</p>
//             <p><strong>Address:</strong> ${address}</p>
//             <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
//             <p><strong>Order ID:</strong> ${generatedOrderId}</p>
//         `;

//         // Send email to admin
//         await sendEmail(process.env.ADMIN_EMAIL, "New Order Placed", adminEmailContent);

//         res.status(201).json({ success: true, order: savedOrder });
//     } catch (error) {
//         console.error("Error placing order:", error);
//         res.status(500).json({ success: false, message: "Failed to place order." });
//     }
// };

module.exports = { getOrders, addOrder, updateOrder, deleteOrder};
