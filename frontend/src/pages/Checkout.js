import React, { useContext } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import "../styles/Checkout.css";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const userId = JSON.parse(localStorage.getItem("user"))?._id; // Get logged-in user ID

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    const handleCashOnDelivery = async () => {
        try {
            await axios.post("http://localhost:4000/api/orders", {
                userId,
                items: cart,
                total: totalPrice,
                paymentMethod: "Cash On Delivery",
                status: "Pending"
            });
            alert("Order placed successfully with Cash on Delivery!");
            clearCart();
        } catch (err) {
            console.error("Error placing order:", err);
            alert("Failed to place order. Please try again.");
        }
    };

    const handlePayWithKhalti = () => {
        const config = {
            publicKey: "test_public_key_7ba34abb8d51408a9cca54dfd919b984", // Replace with your Khalti public key
            productIdentity: "1234567890",
            productName: "iStitch Order",
            productUrl: "http://localhost:3000",
            eventHandler: {
                onSuccess: async (payload) => {
                    try {
                        // Save order to the database
                        await axios.post("http://localhost:4000/api/orders", {
                            userId,
                            items: cart,
                            total: totalPrice,
                            paymentMethod: "Khalti",
                            status: "Paid",
                            khaltiPayload: payload // Save Khalti payment details
                        });
                        alert("Payment successful! Order placed.");
                        clearCart();
                    } catch (err) {
                        console.error("Error saving order:", err);
                        alert("Failed to save order. Please contact support.");
                    }
                },
                onError: (error) => {
                    console.error("Khalti payment error:", error);
                    alert("Payment failed. Please try again.");
                },
                onClose: () => {
                    console.log("Khalti widget is closed.");
                }
            },
            paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"]
        };

        const checkout = new KhaltiCheckout(config);
        checkout.show({ amount: totalPrice * 100 }); // Khalti requires amount in paisa
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
