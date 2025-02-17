const Customer = require("../../models/CustomerSchema");

// Get all customers
const getCustomer = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new customer
const addCustomer = async (req, res) => {
    const { name, email, address, phone, order } = req.body;
    if (!name || !email || !address || !phone || !order) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }
    try {
        const newCustomer = new Customer({ name, email, address, phone, order });
        await newCustomer.save(); // This saves the new customer to the MongoDB database
        res.status(201).json({ success: true, customer: newCustomer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }  
};

// Update a customer
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, address, phone, order } = req.body;
    if (!name || !email || !address || !phone || !order) {
        return res.status(400).json({ success: false, error: "All fields are required" });
    }
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, { name, email, address, phone, order }, { new: true }); // This updates the customer in the MongoDB database
        res.status(200).json({ success: true, customer: updatedCustomer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        await Customer.findByIdAndDelete(id); // This deletes the customer from the MongoDB database
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getCustomer, addCustomer, updateCustomer, deleteCustomer };