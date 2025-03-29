const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
        type: Number
    },
    paymentMethod: {
        type: String,
        enum: ['Cash On Delivery', 'Khalti'],
        required: true
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
