import React, { useContext } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import "../styles/Checkout.css";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    const handleCashOnDelivery = () => {
        alert("Order placed successfully with Cash on Delivery!");
        clearCart();
    };

    const handlePayWithKhalti = () => {
        alert("Redirecting to Khalti payment gateway...");
        // Implement Khalti payment integration here
    };

    return (
        <>
            <Navbar />
            <div className="checkout-page">
                <h2>Checkout</h2>
                <div className="checkout-items">
                    {cart.map(item => (
                        <div key={item._id} className="checkout-item">
                            <img src={item.images[0]} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>${item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="checkout-total">
                    <h3>Total: ${totalPrice.toFixed(2)}</h3>
                    <button className="checkout-btn" onClick={handleCashOnDelivery}>Cash On Delivery</button>
                    <button className="checkout-btn" onClick={handlePayWithKhalti}>Pay With Khalti</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
