import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const userId = JSON.parse(localStorage.getItem("user"))?._id; // Get logged-in user ID

    useEffect(() => {
        const fetchCart = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:4000/api/cart/${userId}`);
                    setCart(response.data.cart || []); // Set cart from database
                } catch (err) {
                    console.error("Error fetching cart:", err);
                }
            }
        };

        fetchCart();
    }, [userId]); // Fetch cart whenever userId changes

    const saveCartToDatabase = async (updatedCart) => {
        if (userId) {
            try {
                const cartItems = updatedCart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity || 1,
                    size: item.selectedSize // Add selected size to cart item
                }));
                await axios.post("http://localhost:4000/api/cart/save", {
                    userId,
                    cartItems
                });
            } catch (err) {
                console.error("Error saving cart:", err);
            }
        }
    };

    const addToCart = (item) => {
        // Check if identical item (same ID and size) already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem._id === item._id && cartItem.selectedSize === item.selectedSize
        );
        
        let updatedCart;

        if (existingItemIndex !== -1) {
            // If identical item exists, increment its quantity
            updatedCart = cart.map((cartItem, index) => 
                index === existingItemIndex
                    ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                    : cartItem
            );
        } else {
            // Otherwise, add new item to cart
            updatedCart = [...cart, { ...item, quantity: 1 }];
        }

        setCart(updatedCart);
        saveCartToDatabase(updatedCart);
    };

    const removeFromCart = (id, size) => {
        const updatedCart = cart.filter(item => 
            !(item._id === id && item.selectedSize === size)
        );
        setCart(updatedCart);
        saveCartToDatabase(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        saveCartToDatabase([]);
    };

    const logout = () => {
        setCart([]); // Clear cart in state
        localStorage.removeItem("user"); // Clear user data
    };

    // Calculate total price with item quantities
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            logout,
            calculateTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
