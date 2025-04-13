import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage if available
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
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
                    quantity: (updatedCart[existingItemIndex].quantity || 1) + quantity
                };
                return updatedCart;
            } else {
                // Otherwise, add as a new item
                return [...prevCart, { ...item, selectedSize, quantity }];
            }
        });
    };

    // Remove an item from the cart
    const removeFromCart = (itemId, selectedSize) => {
        setCart(prevCart => prevCart.filter(
            item => !(item._id === itemId && item.selectedSize === selectedSize)
        ));
    };

    // Update an item's quantity
    const updateQuantity = (itemId, selectedSize, quantity) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item._id === itemId && item.selectedSize === selectedSize) {
                    return { ...item, quantity };
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