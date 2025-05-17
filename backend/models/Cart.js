const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
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
            size: {
                type: String,
                required: true,
                default: "M"
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
