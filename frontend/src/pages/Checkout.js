import React, { useContext, useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import khaltiLogo from "../images/payment/khalti.png";


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

    const totalPrice = calculateTotal();

    useEffect(() => {
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

    const placeOrder = async (paymentMethod, paymentToken = null) => {
        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            return;
        }

        try {
            const orderPayload = {
                userId: userId, // Add userId field
                customer: userId,
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity || 1,
                    size: item.selectedSize,
                    price: Number(item.price)
                })),
                total: Number(totalPrice), // Add total field
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

    const handleKhaltiPayment = async () => {
        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            return;
        }

        // Store contact number and address in localStorage
        // to access them after Khalti payment completion
        localStorage.setItem("checkoutPhone", contactNumber.trim());
        localStorage.setItem("checkoutAddress", address.trim());

        try {
            const paymentData = {
                amount: totalPrice * 100, // Convert to paisa
                purchaseOrderId: `order_${Date.now()}`,
                purchaseOrderName: "iStitch Custom Clothing",
                returnUrl: "http://localhost:3000/order-confirmation"
            };
            
            console.log("Initiating Khalti payment with:", paymentData);
            
            // Test the backend connectivity first
            try {
                const testResponse = await axios.get("http://localhost:4000/api/khalti/test");
                console.log("Test endpoint response:", testResponse.data);
            } catch (testErr) {
                console.error("Test endpoint failed:", testErr);
            }
            
            const response = await axios.post("http://localhost:4000/api/khalti/initiate", paymentData);

            console.log("Khalti initiate response:", response.data);

            if (response.data.success) {
                window.location.href = response.data.paymentUrl; // Redirect to Khalti payment URL
            } else {
                alert("Failed to initiate Khalti payment. Please try again.");
            }
        } catch (err) {
            console.error("Error initiating Khalti payment:", err);
            console.error("Error status:", err.response?.status);
            console.error("Error details:", err.response?.data || err.message);
            
            if (err.response?.status === 404) {
                alert("Payment service endpoint not found. Please contact support.");
            } else {
                alert(`Failed to initiate Khalti payment: ${err.message || "Unknown error"}`);
            }
        }
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
                                <img src={khaltiLogo} alt="Khalti" className="payment-logo" />
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
