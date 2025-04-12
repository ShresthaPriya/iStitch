import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    const removeFromCart = (itemId, selectedSize) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item._id !== itemId || item.selectedSize !== selectedSize)
        );
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};
