const Order = require("../../models/OrderSchema");

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

        console.log("Order Controller - Received payload:", req.body);

        // Basic required fields check
        if (!items || items.length === 0 || !paymentMethod || !status || !fullName || !contactNumber || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Prevent duplicate if orderId is passed
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

        console.log("Creating order with data:", orderData);

        const newOrder = new Order(orderData);
        await newOrder.save();

        console.log("Order saved successfully:", newOrder);
        res.status(201).json({ success: true, order: newOrder });

    } catch (err) {
        console.error("Error adding order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, ...otherFields } = req.body;

    try {
        const updateData = status ? { status } : otherFields;

        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete an order
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

module.exports = { getOrders, addOrder, updateOrder, deleteOrder };
