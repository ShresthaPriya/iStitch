const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
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
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash On Delivery', 'Khalti'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        required: true
    },
    khaltiPayload: {
        type: Object // Store Khalti payment details
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
