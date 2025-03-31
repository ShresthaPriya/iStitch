const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Save or update the cart for a user
router.post('/save', async (req, res) => {
    const { userId, cartItems } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Update existing cart
            cart.items = cartItems;
            await cart.save();
        } else {
            // Create new cart
            cart = new Cart({
                userId,
                items: cartItems
            });
            await cart.save();
        }

        res.json({ success: true, cart });
    } catch (err) {
        console.error("Error saving cart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Retrieve the cart for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find cart document
        const cartDoc = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cartDoc) {
            return res.json({ success: true, cart: [] });
        }

        // Transform cart items to include product details and selected size
        const cart = cartDoc.items.map(item => {
            const product = item.productId;
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                quantity: item.quantity,
                selectedSize: item.size
            };
        });

        res.json({ success: true, cart });
    } catch (err) {
        console.error("Error retrieving cart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
