const Order = require("../../models/OrderSchema");

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("customer");
        res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new order
const addOrder = async (req, res) => {
    const { customer, items, totalAmount, status } = req.body;
    if (!customer || !items || !totalAmount || !status) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
        const newOrder = new Order({ customer, items, totalAmount, status });
        await newOrder.save();
        res.status(201).json({ success: true, order: newOrder });
    } catch (err) {
        console.error("Error adding order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { customer, items, totalAmount, status } = req.body;
    if (!customer || !items || !totalAmount || !status) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { customer, items, totalAmount, status }, { new: true });
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
        await Order.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getOrders, addOrder, updateOrder, deleteOrder };
