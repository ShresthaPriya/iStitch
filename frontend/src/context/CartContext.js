import React, { createContext, useState, useEffect, useContext } from 'react';
// Remove the incorrect import:
// import useAuth from '../hooks/useAuth';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  // Get current user ID from localStorage
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    return 'guest';
  };

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const loadCart = () => {
      const userId = getUserId();
      const cartKey = `cart_${userId}`;
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    };

    loadCart();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadCart);
    
    // Add event listener for auth changes
    window.addEventListener('auth-change', loadCart);
    
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('auth-change', loadCart);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const userId = getUserId();
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem._id === item._id && cartItem.size === item.size
      );

      if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity || 1;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
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