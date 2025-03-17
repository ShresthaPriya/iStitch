const Customer = require("../../models/CustomerSchema");
const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.originalname; 
      console.log('Saving file as:', filename); // Logging filename
  
      cb(null, filename);
    }
  });
  
  
  const upload = multer({ storage: storage })
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
    try{const newCustomer = await Customer.create({
       name,
       email,
       address,
       phone,
       order,
        imageUrl: req.file ? req.file.filename : null, // Ensure imageUrl is null if no file is uploaded
      });
  
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: "Internal server error" });
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

module.exports = { upload, getCustomer, addCustomer, updateCustomer, deleteCustomer };