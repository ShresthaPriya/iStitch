import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from "axios";
import { FiArrowLeft, FiEdit2, FiCheckCircle, FiTruck, FiCreditCard } from "react-icons/fi";
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                orderId: `order_${Date.now()}`,
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

            if (paymentMethod === "Cash On Delivery") {
                const response = await axios.post("/api/orders", orderPayload, {
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
                // Validate contact number and address
                if (!contactNumber.trim() || !address.trim()) {
                    setError("Please provide both contact number and address.");
                    setIsSubmitting(false);
                    return;
                }

                // Store shipping address in localStorage
                const shippingAddress = {
                    address: address.trim(),
                    phone: contactNumber.trim()
                };
                try {
                    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
                    console.log("Shipping address saved to localStorage:", shippingAddress);
                } catch (e) {
                    console.error("Failed to save shipping address to localStorage:", e);
                }

                // Create order payload
                const orderPayload = {
                    orderId: `order_${Date.now()}`,
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
                    paymentMethod: "Khalti",
                    status: "Processing",
                    fullName: user.fullname || "N/A",
                    contactNumber: contactNumber.trim(),
                    address: address.trim(),
                    isCustomOrder: true
                };

                // Store order details in localStorage
                try {
                    localStorage.setItem('pendingKhaltiOrder', JSON.stringify(orderPayload));
                    console.log("Order details saved to localStorage:", orderPayload);
                } catch (e) {
                    console.error("Failed to save order details to localStorage:", e);
                }

                // Proceed with Khalti payment
                const paymentData = {
                    amount: priceEstimate * 100,
                    purchaseOrderId: orderPayload.orderId,
                    purchaseOrderName: "iStitch Custom Clothing",
                    returnUrl: "http://localhost:3000/order-confirmation"
                };

                const response = await axios.post("/api/khalti/initiate", paymentData);
                if (response.data.success) {
                    // Save shipping address and order details again right before redirect
                    // This ensures the data is available when returning from Khalti
                    const shippingAddress = {
                        address: address.trim(),
                        phone: contactNumber.trim()
                    };
                    
                    // Use sessionStorage as it persists across page refreshes within the same tab/window
                    sessionStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
                    sessionStorage.setItem('pendingKhaltiOrder', JSON.stringify(orderPayload));
                    sessionStorage.setItem('khaltiPidx', response.data.pidx);
                    
                    // Double check localStorage as well
                    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
                    localStorage.setItem('pendingKhaltiOrder', JSON.stringify(orderPayload));
                    localStorage.setItem('khaltiPidx', response.data.pidx);
                    
                    console.log("Data saved before redirect:", {
                        shippingAddress,
                        orderPayload,
                        pidx: response.data.pidx
                    });
                    
                    // Small delay to ensure data is saved before redirect
                    setTimeout(() => {
                        window.location.href = response.data.paymentUrl;
                    }, 100);
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

    const formatMeasurements = () => {
        if (!userMeasurements || !Array.isArray(userMeasurements) || userMeasurements.length === 0) {
            return <p className="no-measurements">No measurements available</p>;
        }

        let relevantMeasurements = [...userMeasurements];
        if (customization.itemToBeMade.includes("Shirt") || (customization.itemToBeMade.includes("Half Shirt"))|| customization.itemToBeMade.includes("Blazer") || customization.itemToBeMade.includes("Coat")) {
            const upperBodyMeasurements = ["Chest", "Shoulder Length", "Sleeves Length", "Neck", "Waist", "Upper Body Length"];
            relevantMeasurements = userMeasurements.filter(m => 
                upperBodyMeasurements.some(ubm => m.title.includes(ubm))
            );
        }
        if (customization.itemToBeMade.includes("Pant")) {
            const lowerBodyMeasurements = ["Waist", "Hip", "Thigh", "Leg Opening", "Inseam"];
            relevantMeasurements = userMeasurements.filter(m => 
                lowerBodyMeasurements.some(lbm => m.title.includes(lbm))
            );
        }

        return (
            <div className="measurements-grid">
                {relevantMeasurements.map((m, index) => (
                    <div key={index} className="measurement-item">
                        <span className="measurement-title">{m.title}:</span>
                        <span className="measurement-value">{m.value} {m.unit}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="review-order-page">
                <div className="order-header">
                    <h2>Review Your Custom Order</h2>
                    <p className="order-steps">Step 3 of 3: Review & Payment</p>
                </div>
                
                {error && (
                    <div className="alert alert-error">
                        <FiCheckCircle className="alert-icon" />
                        <span>{error}</span>
                    </div>
                )}
                
                <div className="order-sections-container">
                    {/* Order Summary Section */}
                    <div className="order-section">
                        <div className="section-header">
                            <h3>Order Summary</h3>
                            <span className="section-number">1</span>
                        </div>
                        <div className="product-summary">
                            <div className="product-image-container">
                                <img 
                                    src={`/images/${fabric.images[0]}`} 
                                    alt={fabric.name}
                                    className="product-image" 
                                />
                                <div className="fabric-badge">{fabric.category}</div>
                            </div>
                            <div className="product-details">
                                <h4>Custom {customization.itemToBeMade}</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Fabric:</span>
                                    <span className="detail-value">{fabric.name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Style:</span>
                                    <span className="detail-value">{customization.style}</span>
                                </div>
                                {customization.additionalStyling && (
                                    <div className="detail-row">
                                        <span className="detail-label">Details:</span>
                                        <span className="detail-value">{customization.additionalStyling}</span>
                                    </div>
                                )}
                                <div className="price-container">
                                    <span className="price-label">Total:</span>
                                    <span className="price-value">Rs. {priceEstimate.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Measurements Section */}
                    <div className="order-section">
                        <div className="section-header">
                            <h3>Your Measurements</h3>
                            <span className="section-number">2</span>
                        </div>
                        <div className="measurements-content">
                            {formatMeasurements()}
                            <button 
                                className="edit-btn"
                                onClick={() => navigate('/customer-measurements')}
                            >
                                <FiEdit2 className="edit-icon" />
                                Edit Measurements
                            </button>
                        </div>
                    </div>

                    {/* Shipping Section */}
                    <div className="order-section">
                        <div className="section-header">
                            <h3>Shipping Information</h3>
                            <span className="section-number">3</span>
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input 
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter full delivery address"
                                className="form-textarea"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="order-section">
                        <div className="section-header">
                            <h3>Payment Method</h3>
                            <span className="section-number">4</span>
                        </div>
                        <div className="payment-options">
                            <div 
                                className={`payment-option ${paymentMethod === "Cash On Delivery" ? "selected" : ""}`}
                                onClick={() => setPaymentMethod("Cash On Delivery")}
                            >
                                <div className="payment-icon">
                                    <FiTruck />
                                </div>
                                <div className="payment-details">
                                    <div className="payment-method-name">Cash On Delivery</div>
                                    <div className="payment-description">Pay when you receive your order</div>
                                </div>
                                <div className="payment-radio">
                                    {paymentMethod === "Cash On Delivery" && <div className="radio-selected"></div>}
                                </div>
                            </div>
                            <div 
                                className={`payment-option ${paymentMethod === "Khalti" ? "selected" : ""}`}
                                onClick={() => setPaymentMethod("Khalti")}
                            >
                                <div className="payment-icon">
                                <img src="/images/payment/khalti.png" alt="Khalti" className="payment-logo" width={20} height={20}/>
                                </div>
                                <div className="payment-details">
                                    <div className="payment-method-name">Khalti</div>
                                    <div className="payment-description">Secure online payment</div>
                                </div>
                                <div className="payment-radio">
                                    {paymentMethod === "Khalti" && <div className="radio-selected"></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="back-icon" />
                        Back
                    </button>
                    <button 
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={loading || isSubmitting}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            "Place Order"
                        )}
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewOrder;