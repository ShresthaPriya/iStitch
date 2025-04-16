import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from "axios";
import "../styles/ReviewOrder.css";

const ReviewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fabric, customization, priceEstimate, userMeasurements } = location.state || {};
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Keep only one declaration of isSubmitting

    // Redirect if no data
    if (!fabric || !customization || !priceEstimate) {
        navigate('/fabric-collection');
        return null;
    }

    const handlePlaceOrder = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            setIsSubmitting(false);
            return;
        }

        try {
            setLoading(true);

            // Create the order payload
            const orderPayload = {
                orderId: `order_${Date.now()}`, // Add unique orderId
                customer: userId,
                userId: userId,
                items: [{
                    productId: fabric._id,
                    quantity: 1,
                    price: priceEstimate,
                    customDetails: {
                        fabricId: fabric._id,
                        fabricName: fabric.name,
                        itemType: customization.itemToBeMade,
                        style: customization.style,
                        additionalStyling: customization.additionalStyling
                    }
                }],
                total: priceEstimate,
                totalAmount: priceEstimate,
                paymentMethod: paymentMethod,
                status: paymentMethod === "Khalti" ? "Processing" : "Pending",
                fullName: user.fullname || "N/A",
                contactNumber: contactNumber.trim(),
                address: address.trim(),
                isCustomOrder: true
            };

            console.log("Order Payload:", orderPayload);

            if (paymentMethod === "Cash On Delivery") {
                // Send the order to the backend for COD
                const response = await axios.post("http://localhost:4000/api/orders", orderPayload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.success) {
                    alert("Order placed successfully!");
                    navigate('/order-confirmation', { state: { orderId: response.data.order._id } });
                } else {
                    setError("Failed to place order. Please try again.");
                }
            } else if (paymentMethod === "Khalti") {
                // Initiate Khalti payment
                const paymentData = {
                    amount: priceEstimate * 100, // Convert to paisa
                    purchaseOrderId: `order_${Date.now()}`,
                    purchaseOrderName: "iStitch Custom Clothing",
                    returnUrl: "http://localhost:3000/order-confirmation"
                };

                const response = await axios.post("http://localhost:4000/api/khalti/initiate", paymentData);
                if (response.data.success) {
                    window.location.href = response.data.paymentUrl; // Redirect to Khalti payment URL
                } else {
                    setError(response.data.message || "Failed to initiate Khalti payment. Please try again.");
                }
            }
        } catch (err) {
            console.error("Error placing order:", err.response?.data || err.message);
            setError(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    // Format measurements for display
    const formatMeasurements = () => {
        if (!userMeasurements || !Array.isArray(userMeasurements) || userMeasurements.length === 0) {
            return <p>No measurements available</p>;
        }

        // Filter relevant measurements based on item type
        let relevantMeasurements = [...userMeasurements];
        if (customization.itemToBeMade.includes("Shirt") || customization.itemToBeMade.includes("Blazer") || customization.itemToBeMade.includes("Coat")) {
            // For upper body garments, filter relevant measurements
            const upperBodyMeasurements = ["Chest", "Shoulder Length", "Sleeves Length", "Neck", "Waist", "Upper Body Lenght"];
            relevantMeasurements = userMeasurements.filter(m => 
                upperBodyMeasurements.some(ubm => m.title.includes(ubm))
            );
        }
        if (customization.itemToBeMade.includes("Pant")) {
            // For pants, filter relevant measurements
            const lowerBodyMeasurements = ["Waist", "Hip", "Thigh", "Leg Opening"];
            relevantMeasurements = userMeasurements.filter(m => 
                lowerBodyMeasurements.some(lbm => m.title.includes(lbm))
            );
        }

        return (
            <div className="measurements-grid">
                {relevantMeasurements.map((m, index) => (
                    <div key={index} className="measurement-item">
                        <span>{m.title}:</span>
                        <span>{m.value} {m.unit}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="review-order-page">
                <h2>Review Your Custom Order</h2>
                {error && <div className="error-message">{error}</div>}
                
                <div className="order-summary-section">
                    <h3>Order Summary</h3>
                    <div className="product-summary">
                        <div className="product-image">
                            <img 
                                src={`http://localhost:4000/images/${fabric.images[0]}`} 
                                alt={fabric.name} 
                            />
                        </div>
                        <div className="product-details">
                            <h4>Custom {customization.itemToBeMade}</h4>
                            <p><strong>Fabric:</strong> {fabric.name}</p>
                            <p><strong>Style:</strong> {customization.style}</p>
                            {customization.additionalStyling && (
                                <p><strong>Additional Details:</strong> {customization.additionalStyling}</p>
                            )}
                            <div className="price">Total Price: ${priceEstimate}</div>
                        </div>
                    </div>
                </div>
                <div className="measurements-section">
                    <h3>Your Measurements</h3>
                    {formatMeasurements()}
                    <button 
                        className="edit-measurements-btn"
                        onClick={() => navigate('/customer-measurements')}
                    >
                        Edit Measurements
                    </button>
                </div>
                <div className="shipping-section">
                    <h3>Shipping Information</h3>
                    
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input 
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Enter your contact number"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Delivery Address</label>
                        <input 
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            required
                        />
                    </div>
                </div>
                <div className="payment-section">
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                        <div 
                            className={`payment-option ${paymentMethod === "Cash On Delivery" ? "selected" : ""}`}
                            onClick={() => setPaymentMethod("Cash On Delivery")}
                        >
                            <div className="payment-radio">
                                <div className={`radio-inner ${paymentMethod === "Cash On Delivery" ? "selected" : ""}`}></div>
                            </div>
                            <div className="payment-label">Cash On Delivery</div>
                        </div>
                        <div 
                            className={`payment-option ${paymentMethod === "Khalti" ? "selected" : ""}`}
                            onClick={() => setPaymentMethod("Khalti")}
                        >
                            <div className="payment-radio">
                                <div className={`radio-inner ${paymentMethod === "Khalti" ? "selected" : ""}`}></div>
                            </div>
                            <div className="payment-label">
                                <img src="http://localhost:3000/images/payment/khalti.png" alt="Khalti" className="payment-logo" />
                                Khalti
                            </div>
                        </div>
                    </div>
                </div>
                <div className="action-buttons">
                    <button 
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <button 
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={loading || isSubmitting}
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewOrder;
