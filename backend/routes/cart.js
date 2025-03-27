const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

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
            // Create a new cart
            cart = new Cart({ userId, items: cartItems });
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
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (cart) {
            const populatedCart = cart.items.map(item => ({
                ...item.productId._doc,
                quantity: item.quantity
            }));
            res.json({ success: true, cart: populatedCart });
        } else {
            res.json({ success: true, cart: [] }); // Return an empty cart if none exists
        }
    } catch (err) {
        console.error("Error retrieving cart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
