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
    const [isSubmitting, setIsSubmitting] = useState(false); // Add state to track submission

    const totalPrice = calculateTotal();

    useEffect(() => {
        // Fetch user measurements when component mounts
        const fetchUserMeasurements = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`/api/user-measurements/${userId}`);
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

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        try {
            // Get the user information from localStorage
            const userInfo = JSON.parse(localStorage.getItem('user'));
            
            if (!userInfo || !userInfo._id) {
                setError('User information not found. Please login again.');
                setIsSubmitting(false);
                return;
            }
            
            // Calculate the total amount
            const totalAmount = calculateTotal();
            
            // Prepare the order items from the cart
            const orderItems = cart.map(item => ({
                productId: item._id, // Ensure this field is included
                quantity: item.quantity || 1,
                price: item.price,
                size: item.selectedSize || 'default',
            }));
            
            // Create the order payload - ensure totalAmount is included
            const orderPayload = {
                userId: userInfo._id,
                customer: userInfo._id,
                fullName: user.fullname || "N/A",
                contactNumber: contactNumber.trim(),
                address: address.trim(),
                items: orderItems,
                total: totalAmount,          // Add total to match backend expectation
                totalAmount: totalAmount, // Explicitly set totalAmount
                status: paymentMethod === "Khalti" ? "Processing" : "Pending",
                paymentMethod: paymentMethod,
                paymentToken: null // For COD, no token is needed
            };
            
            console.log('Order Payload:', orderPayload);
            
            // Send the order to the backend
            const response = await axios.post('/api/orders', orderPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            console.log('Order Response:', response.data);
            
            // Clear the cart after successful order
            if (response.data.success) {
                clearCart();
                // Redirect to order confirmation page
                navigate('/order-confirmation', { state: { orderId: response.data.order._id } });
            }
            
        } catch (error) {
            console.error('Error placing order:', error.response?.data || error);
            setError(error.response?.data?.error || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false); // Re-enable the button after the request completes
        }
    };

    const handleCashOnDelivery = () => {
        handlePlaceOrder({ preventDefault: () => {} });
    };

    const handleKhaltiPayment = async () => {
        if (!contactNumber.trim() || !address.trim()) {
            setError("Please provide both contact number and address.");
            return;
        }

        try {
            // Calculate the total amount
            const totalAmount = calculateTotal();

            // Prepare the order items from the cart
            const orderItems = cart.map(item => ({
                productId: item._id,
                quantity: item.quantity || 1,
                price: item.price,
                size: item.selectedSize || item.size || 'default',
            }));

            // Create the order payload - ensure totalAmount is included
            const orderPayload = {
                userId: user._id,
                customer: user._id,
                fullName: user.fullname || "N/A",
                contactNumber: contactNumber.trim(),
                address: address.trim(),
                items: orderItems,
                total: totalAmount,
                totalAmount: totalAmount,
                status: "Processing",
                paymentMethod: "Khalti",
                paymentToken: null
            };

            // Backup cart and order details before redirecting to Khalti
            localStorage.setItem('khaltiCartBackup', JSON.stringify(cart));
            localStorage.setItem('pendingKhaltiOrder', JSON.stringify(orderPayload));
            localStorage.setItem('shippingAddress', JSON.stringify({
                address: address.trim(),
                phone: contactNumber.trim()
            }));
            sessionStorage.setItem('pendingKhaltiOrder', JSON.stringify(orderPayload));
            sessionStorage.setItem('shippingAddress', JSON.stringify({
                address: address.trim(),
                phone: contactNumber.trim()
            }));

            // Prepare the Khalti payment data
            const paymentData = {
                amount: totalAmount * 100, // Convert to paisa
                purchaseOrderId: `order_${Date.now()}`,
                purchaseOrderName: "iStitch Custom Clothing",
                returnUrl: "http://localhost:3000/order-confirmation",
            };

            // Send the payment initiation request to the backend
            const response = await axios.post("/api/khalti/initiate", paymentData);

            if (response.data.success) {
                localStorage.setItem('khaltiPidx', response.data.pidx);
                sessionStorage.setItem('khaltiPidx', response.data.pidx);
                window.location.href = response.data.paymentUrl;
            } else {
                alert(response.data.message || "Failed to initiate Khalti payment. Please try again.");
            }
        } catch (err) {
            console.error("Error initiating Khalti payment:", err.response?.data || err.message);
            alert(`Failed to initiate Khalti payment: ${err.response?.data?.message || err.message}`);
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
                        <div key={`${item._id}-${item.selectedSize || item.size}-${index}`} className="checkout-item">
                            <img src={`/images/${item.images[0]}`} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p className="checkout-item-size">
                                  Size: {item.selectedSize || item.size || "N/A"}
                                </p>
                                <p className="checkout-item-quantity">Quantity: {item.quantity || 1}</p>
                                <p className="checkout-item-price">
                                    Rs. {item.price} × {item.quantity || 1} = Rs. {(item.price * (item.quantity || 1)).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="checkout-total">
                    <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
                    
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
                        <button 
                            className="checkout-btn" 
                            onClick={handlePlaceOrder} 
                            disabled={isSubmitting} // Disable button while submitting
                        >
                            {isSubmitting ? "Placing Order..." : "Place Order - Cash On Delivery"}
                        </button>
                    ) : (
                        <button className="checkout-btn khalti-btn" onClick={handleKhaltiPayment}>
                            Pay with Khalti
                        </button>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
