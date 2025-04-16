const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        size: {
            type: String,
            default: "M"
        },
        price: {
            type: Number,
            required: true
        },
        customDetails: {
            fabricId: mongoose.Schema.Types.ObjectId,
            fabricName: String,
            itemType: String,
            style: String,
            additionalStyling: String
        }
    }],
    total: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true // Ensure totalAmount is required
    },
    paymentMethod: {
        type: String,
        enum: ['Cash On Delivery', 'Khalti'],
        required: true
    },
    paymentToken: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isCustomOrder: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
