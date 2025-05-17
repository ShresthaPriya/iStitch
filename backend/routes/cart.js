const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Save or update the cart for a user
router.post('/save', async (req, res) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !items) {
            return res.status(400).json({ success: false, message: "User ID and items are required" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            const newCart = new Cart({ userId, items });
            await newCart.save();
            return res.json({ success: true, message: "Cart saved successfully", cart: newCart });
        }

        // Update the existing cart
        cart.items = items;

        try {
            await cart.save();
            res.json({ success: true, message: "Cart updated successfully", cart });
        } catch (err) {
            if (err.name === 'VersionError') {
                console.error("Version conflict detected. Retrying...");
                // Reload the cart and retry saving
                const freshCart = await Cart.findOne({ userId });
                freshCart.items = items;
                await freshCart.save();
                res.json({ success: true, message: "Cart updated successfully after retry", cart: freshCart });
            } else {
                throw err;
            }
        }
    } catch (err) {
        console.error("Error saving cart:", err);
        res.status(500).json({ success: false, message: "Failed to save cart", error: err.message });
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
