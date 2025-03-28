import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/ReviewOrder.css";
import axios from "axios";

const ReviewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderDetails } = location.state;
    const [contactNumber, setContactNumber] = useState(orderDetails.contactNumber || "");
    const [address, setAddress] = useState(orderDetails.address || "");

    const handlePlaceOrder = async () => {
        if (!contactNumber.trim() || !address.trim()) {
            alert("Please fill in all required fields.");
            return;
        }

        const orderPayload = {
            userId: orderDetails.userId, // Ensure userId is included
            items: orderDetails.items.map(item => ({
                productId: item.productId || item._id, // Ensure productId is included
                quantity: item.quantity || 1,
                price: item.price
            })),
            total: orderDetails.total,
            paymentMethod: "Cash On Delivery",
            status: "Pending",
            fullName: orderDetails.fullName || "N/A",
            contactNumber: contactNumber.trim(),
            address: address.trim()
        };

        console.log("Order Payload:", orderPayload); // Log the payload for debugging

        try {
            const response = await axios.post("http://localhost:4000/api/orders", orderPayload);
            console.log("Order Response:", response.data); // Log the response from the backend
            alert("Order placed successfully!");
            navigate('/order-history');
        } catch (err) {
            console.error("Error placing order:", err.response?.data || err.message);
            if (err.response) {
                console.error("Backend Response:", err.response.data); // Log backend response
            }
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="review-order-page">
                <h2>Review Your Order</h2>
                <div className="order-details">
                    <h3>Order Items</h3>
                    {orderDetails.items.map((item, index) => (
                        <div key={index} className="order-item">
                            <p><strong>{item.name}</strong> - ${item.price}</p>
                        </div>
                    ))}
                    <h3>Total: ${orderDetails.total.toFixed(2)}</h3>
                    <h3>Full Name</h3>
                    <p>{orderDetails.fullName}</p>
                    <h3>Contact Number</h3>
                    <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter your contact number"
                        required
                    />
                    <h3>Address</h3>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        required
                    />
                    <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewOrder;
