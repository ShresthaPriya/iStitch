const mongoose = require('mongoose');

// Use singleton pattern to prevent model recompilation
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    sizes: {
        type: [{
            size: {
                type: String,
                required: true
            },
            inventory: {
                type: Number,
                default: 0
            },
            available: {
                type: Boolean,
                default: true
            }
        }],
        default: [
            { size: 'S', inventory: 10, available: true },
            { size: 'M', inventory: 10, available: true },
            { size: 'L', inventory: 10, available: true },
            { size: 'XL', inventory: 10, available: true }
        ]
    }
}, { timestamps: true });

// Check if the model is already defined before creating a new one
const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

module.exports = Item;
