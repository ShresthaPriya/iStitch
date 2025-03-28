import React, { useContext } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user details
    const userEmail = user?.email;
    const userId = user?._id; // Ensure userId is retrieved correctly
    const navigate = useNavigate();

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    const handleCashOnDelivery = async () => {
        try {
            // Fetch user details using email
            const userResponse = await axios.get(`http://localhost:4000/api/users/email/${userEmail}`);
            const user = userResponse.data;

            // Navigate to the review order page with the fetched data
            navigate('/review-order', {
                state: {
                    orderDetails: {
                        userId, // Pass userId to the order details
                        items: cart,
                        total: totalPrice,
                        fullName: user.fullname || "N/A",
                        address: user.address || "N/A", // Include address if available
                        contactNumber: user.contactNumber || "N/A" // Include contact number if available
                    }
                }
            });
        } catch (err) {
            console.error("Error fetching user details:", err.response?.data || err.message);
            alert("Failed to proceed with Cash on Delivery. Please try again.");
        }
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
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
