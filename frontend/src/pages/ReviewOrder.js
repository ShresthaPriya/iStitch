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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if no data
    if (!fabric || !customization || !priceEstimate) {
        navigate('/fabric-collection');
        return null;
    }

    const handlePlaceOrder = async () => {
        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            return;
        }

        try {
            setLoading(true);
            
            // Create the order payload with both total and userId fields
            const orderPayload = {
                customer: userId,
                userId: userId, // Add userId explicitly to match schema requirements
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
                total: priceEstimate, // Add total explicitly
                totalAmount: priceEstimate, // Include totalAmount for backward compatibility
                paymentMethod: "Cash On Delivery",
                status: "Pending",
                fullName: user.fullname || "N/A",
                contactNumber: contactNumber.trim(),
                address: address.trim(),
                isCustomOrder: true
            };

            console.log("Custom Order Payload:", orderPayload);

            const response = await axios.post("http://localhost:4000/api/orders", orderPayload);
            
            if (response.data.success) {
                alert("Custom order placed successfully!");
                navigate('/order-history');
            } else {
                setError("Failed to place order. Please try again.");
            }
        } catch (err) {
            console.error("Error placing order:", err);
            setError(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
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
                    <div className="payment-method">
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            checked
                            readOnly
                        />
                        <label htmlFor="cod">Cash On Delivery</label>
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
                        disabled={loading}
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
