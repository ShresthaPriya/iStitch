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
            customer, omer, 
            userId, 
            items, 
            total, 
            totalAmount, ount, 
            paymentMethod, , 
            status, 
            fullName, , 
            contactNumber, ber, 
            address,
            isCustomOrder,Order 
            orderId
        } = req.body;
        console.log("Order Controller - Received payload:", req.body);
        console.log("Order Controller - Received payload:", req.body);
        // Check for duplicate orders within the last 5 minutes
        // Check if the orderId already exists
        const existingOrder = await Order.findOne({ orderId });
        if (existingOrder) {
            return res.status(400).json({ success: false, message: "Order already exists." });licates
        }dAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Within the last 5 minutes

        // Ensure proper field mapping and explicitly set totalAmount
        const orderData = {gOrder) {
            userId: customer || userId, // Use customer field as userId if provideds.status(400).json({ success: false, message: "Duplicate order detected. Please wait before placing another order." });
            customer: customer || userId, // Set the customer reference
            items,
            totalAmount: totalAmount || total, // Explicitly set totalAmountitly set totalAmount
            paymentMethod,nst orderData = {
            status,            userId: customer || userId, // Use customer field as userId if provided
            fullName,/ Set the customer reference
            contactNumber,
            address,Explicitly set totalAmount
            isCustomOrder: isCustomOrder || false,d,
            orderId
        };Name,
   contactNumber,
        // Validate items for custom orders            address,
        if (isCustomOrder) {
            orderData.items = items.map(item => ({        };
                ...item,
                customDetails: item.customDetails || {} // Ensure customDetails is included
            }));
        }            orderData.items = items.map(item => ({

        console.log("Creating order with data:", orderData); customDetails is included

        // Create and save the order
        const newOrder = new Order(orderData);
        await newOrder.save();   console.log("Creating order with data:", orderData);

        console.log("Order saved successfully:", newOrder);        // Create and save the order
        res.status(201).json({ success: true, order: newOrder });rder = new Order(orderData);
    } catch (err) {
        console.error("Error adding order:", err);
        res.status(500).json({ success: false, error: err.message }); newOrder);
    }    res.status(201).json({ success: true, order: newOrder });
};ch (err) {

// Update an ordersage });
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, ...otherFields } = req.body;
    
    try { (req, res) => {
        // Allow updating just the status or other fields{ id } = req.params;
        const updateData = status ? { status } : otherFields;t { status, ...otherFields } = req.body;
        
        const updatedOrder = await Order.findByIdAndUpdate(
            id, / Allow updating just the status or other fields
            updateData, const updateData = status ? { status } : otherFields;
            { new: true }
        );edOrder = await Order.findByIdAndUpdate(
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, error: "Order not found" });       { new: true }
        }      );
                
        res.status(200).json({ success: true, order: updatedOrder });edOrder) {
    } catch (err) { success: false, error: "Order not found" });
        console.error("Error updating order:", err);
        res.status(500).json({ success: false, error: err.message });
    }er });
};tch (err) {
 updating order:", err);
// Delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        
        if (!deletedOrder) {
            return res.status(404).json({ success: false, error: "Order not found" });ry {
        }      const deletedOrder = await Order.findByIdAndDelete(id);
                
        res.status(200).json({ success: true, message: "Order deleted successfully" });







module.exports = { getOrders, addOrder, updateOrder, deleteOrder };};    }        res.status(500).json({ success: false, error: err.message });        console.error("Error deleting order:", err);    } catch (err) {            return res.status(404).json({ success: false, error: "Order not found" });
        }
        
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getOrders, addOrder, updateOrder, deleteOrder };