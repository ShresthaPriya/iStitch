import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/Cart.css";

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
    }, []);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <>
            <Navbar />
            <div className="cart-page">
                <h2>Shopping Cart</h2>
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item._id} className="cart-item">
                            <img src={item.images[0]} alt={item.name} />
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-total">
                    <h3>Total: ${getTotalPrice()}</h3>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;
