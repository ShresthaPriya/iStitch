const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        default: function() {
            return this.totalAmount; // Default to totalAmount if not provided
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
