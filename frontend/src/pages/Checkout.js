import React, { useContext, useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import khaltiConfig from "../config/khaltiConfig";
import "../styles/Checkout.css";

const Checkout = () => {
    const { cart, clearCart, calculateTotal } = useContext(CartContext);
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user details
    const userId = user?._id;
    const navigate = useNavigate();

    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [userMeasurements, setUserMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
    const [khaltiCheckout, setKhaltiCheckout] = useState(null);

    useEffect(() => {
        // Create Khalti checkout instance
        if (window.KhaltiCheckout) {
            const config = { ...khaltiConfig };
            
            // Customize the event handlers with component-specific logic
            config.eventHandler = {
                onSuccess: async (payload) => {
                    console.log("Payment successful:", payload);
                    
                    try {
                        // Verify the payment server-side
                        const verificationResponse = await axios.post(
                            "http://localhost:4000/api/khalti/verify", 
                            {
                                token: payload.token,
                                amount: payload.amount
                            }
                        );
                        
                        if (verificationResponse.data.success) {
                            // Process the order with payment information
                            await placeOrder("Khalti", payload.token);
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Error during payment verification:", err);
                        alert("Payment processing error. Please try again or contact support.");
                    }
                },
                onError: (error) => {
                    console.error("Khalti payment error:", error);
                    setError("Payment failed. Please try again.");
                },
                onClose: () => {
                    console.log("Khalti payment widget closed");
                }
            };
            
            setKhaltiCheckout(new window.KhaltiCheckout(config));
        }
        
        // Fetch user measurements when component mounts
        const fetchUserMeasurements = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/user-measurements/${userId}`);
                if (response.data.success) {
                    setUserMeasurements(response.data.measurements);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user measurements:", err);
                setUserMeasurements([]);
                setLoading(false);
            }
        };

        fetchUserMeasurements();
    }, [userId]);

    const totalPrice = calculateTotal();

    const placeOrder = async (paymentMethod, paymentToken = null) => {
        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            return;
        }

        try {
            const orderPayload = {
                customer: userId,
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity || 1,
                    size: item.selectedSize,
                    price: Number(item.price)
                })),
                totalAmount: Number(totalPrice),
                paymentMethod,
                status: paymentMethod === "Khalti" ? "Processing" : "Pending",
                fullName: user.fullname || "N/A",
                contactNumber: contactNumber.trim(),
                address: address.trim(),
                paymentToken // Include the payment token for Khalti payments
            };

            console.log("Order Payload:", orderPayload);

            const response = await axios.post("http://localhost:4000/api/orders", orderPayload);
            console.log("Order Response:", response.data);
            
            if (response.data.success) {
                alert("Order placed successfully!");
                clearCart();
                navigate('/order-history');
            } else {
                alert(response.data.message || "Failed to place order");
            }
        } catch (err) {
            console.error("Error placing order:", err.response?.data || err.message);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleCashOnDelivery = () => {
        placeOrder("Cash On Delivery");
    };

    const handleKhaltiPayment = () => {
        if (!khaltiCheckout) {
            alert("Payment system is not ready yet. Please try again later.");
            return;
        }
        
        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            return;
        }
        
        // Clear any previous errors
        setError("");
        
        const amountInPaisa = totalPrice * 100; // Convert to paisa (Khalti's smallest unit)
        
        khaltiCheckout.show({
            amount: amountInPaisa,
            mobile: contactNumber,
            customer_info: {
                name: user.fullname,
                email: user.email,
                address: address
            },
            product_details: cart.map(item => ({
                identity: item._id,
                name: item.name,
                total_price: item.price * (item.quantity || 1) * 100,
                quantity: item.quantity || 1,
                unit_price: item.price * 100
            }))
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="checkout-page">
                    <h2>Checkout</h2>
                    <div className="loading-spinner">Loading...</div>
                </div>
                <Footer />
            </>
        );
    }

    // Redirect to measurements page if no measurements found
    if (userMeasurements.length === 0) {
        return (
            <>
                <Navbar />
                <div className="checkout-page">
                    <h2>Checkout</h2>
                    <div className="no-measurements-message">
                        <p>Please save your measurements before placing an order.</p>
                        <p>This helps us tailor your items perfectly to your size.</p>
                        <button 
                            className="save-measurements-btn"
                            onClick={() => navigate('/customer-measurements')}
                        >
                            Go to Measurements Page
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="checkout-page">
                <h2>Checkout</h2>
                <div className="checkout-items">
                    {cart.map((item, index) => (
                        <div key={`${item._id}-${item.selectedSize}-${index}`} className="checkout-item">
                            <img src={`http://localhost:4000/images/${item.images[0]}`} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p className="checkout-item-size">Size: {item.selectedSize}</p>
                                <p className="checkout-item-quantity">Quantity: {item.quantity || 1}</p>
                                <p className="checkout-item-price">
                                    ${item.price} × {item.quantity || 1} = ${(item.price * (item.quantity || 1)).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="checkout-total">
                    <h3>Total: ${totalPrice.toFixed(2)}</h3>
                    
                    {/* Display user measurements summary */}
                    <div className="measurements-summary">
                        <h4>Your Measurements</h4>
                        <div className="measurements-grid">
                            {userMeasurements.map((measurement, index) => (
                                <div key={index} className="measurement-item">
                                    <span>{measurement.title}:</span> 
                                    <span>{measurement.value} {measurement.unit}</span>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="edit-measurements-link"
                            onClick={() => navigate('/customer-measurements')}
                        >
                            Edit Measurements
                        </button>
                    </div>

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
                        <label>Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            required
                        />
                    </div>
                    
                    <div className="payment-methods">
                        <h4>Payment Method</h4>
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
                                    <img src="/khalti-logo.png" alt="Khalti" className="payment-logo" />
                                    Khalti
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    {paymentMethod === "Cash On Delivery" ? (
                        <button className="checkout-btn" onClick={handleCashOnDelivery}>Place Order - Cash On Delivery</button>
                    ) : (
                        <button className="checkout-btn khalti-btn" onClick={handleKhaltiPayment}>Pay with Khalti</button>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
