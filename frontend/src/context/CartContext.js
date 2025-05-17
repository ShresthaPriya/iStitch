import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for potential API calls

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage if available
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            return [];
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // If user is logged in, we could also update cart in database
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                // Optional: Sync with backend if you want server-side cart storage
                // This would require implementing the corresponding API endpoint
                // updateCartInDatabase(cart);
            }
        } catch (error) {
            console.error("Error saving cart to localStorage:", error);
        }
    }, [cart]);

    // Add an item to the cart
    const addToCart = (item, selectedSize, quantity = 1) => {
        setCart(prevCart => {
            // Check if the item with the same ID and size already exists
            const existingItemIndex = prevCart.findIndex(
                cartItem => cartItem._id === item._id && cartItem.selectedSize === selectedSize
            );

            if (existingItemIndex !== -1) {
                // If it exists, update the quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + quantity
                };
                return updatedCart;
            } else {
                // If it doesn't exist, add it to the cart
                return [...prevCart, { ...item, selectedSize, quantity }];
            }
        });
    };

    // Remove an item from the cart
    const removeFromCart = (itemId, selectedSize) => {
        setCart(prevCart => prevCart.filter(item => 
            !(item._id === itemId && item.selectedSize === selectedSize)
        ));
    };

    // Update the quantity of an item in the cart
    const updateQuantity = (itemId, selectedSize, newQuantity) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item._id === itemId && item.selectedSize === selectedSize) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    // Clear the entire cart
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart'); // Ensure localStorage is cleared only when explicitly called
    };

    // Calculate the total price of items in the cart
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            calculateTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};