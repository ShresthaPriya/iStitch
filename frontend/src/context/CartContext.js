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
                    quantity: item.quantity || 1
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
        const existingItem = cart.find(cartItem => cartItem._id === item._id);
        let updatedCart;

        if (existingItem) {
            updatedCart = cart.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                    : cartItem
            );
        } else {
            updatedCart = [...cart, { ...item, quantity: 1 }];
        }

        setCart(updatedCart);
        saveCartToDatabase(updatedCart);
    };

    const removeFromCart = (id) => {
        const updatedCart = cart.filter(item => item._id !== id);
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

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, logout }}>
            {children}
        </CartContext.Provider>
    );
};
