const mongoose = require("mongoose");

// Clear Mongoose cache in development to prevent OverwriteModelError
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.User;
    delete mongoose.modelSchemas.User;
}

const UserSchema = new mongoose.Schema({
    googleId: { 
        type: String, 
        unique: true 
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: function () {
            // Password is required only if the user is not created via Google OAuth
            return !this.googleId;
        },
        default: null
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }, 
    acceptedTerms: { type: Boolean, default: false },  // New field to track terms acceptance

},
    { timestamps: true }
);

// Use existing model if it exists, otherwise define a new one
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

const Order = require("../models/OrderSchema"); // Adjust the path as necessary
const Customer = require("../models/CustomerSchema"); // Adjust the path as necessary
const Item = require("../models/ItemSchema"); // Adjust the path as necessary

const getMetrics = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: "completed" } }, // Only include completed orders
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }, // Sum the totalAmount field
    ]);

    const metrics = {
      customerCount: await Customer.countDocuments(),
      pendingOrderCount: await Order.countDocuments({ status: "pending" }),
      totalOrderCount: await Order.countDocuments(),
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0, // Use 0 if no sales
      totalItemCount: await Item.countDocuments(),
      orderStatusCounts: await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      ordersByDate: await Order.aggregate([
        { $group: { _id: "$orderDate", count: { $sum: 1 } } },
      ]),
    };

    res.status(200).json({ metrics });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};

module.exports = {
  getMetrics,
};