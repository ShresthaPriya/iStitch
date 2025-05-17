import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Add a debounce mechanism to avoid repeated calls
        let isFirstLoad = true;
        
        const processKhaltiPayment = async () => {
            // If already processing or not first load, don't proceed
            if (isProcessing || !isFirstLoad) return;
            isFirstLoad = false;
            
            try {
                setIsProcessing(true);
                
                // Check if this is a Khalti redirect
                const queryParams = new URLSearchParams(location.search);
                const pidx = queryParams.get('pidx');
                const status = queryParams.get('status');
                
                console.log("Query params:", { pidx, status });
                
                // Check if this payment was already processed in this session
                const processedPayments = JSON.parse(localStorage.getItem('processedKhaltiPayments') || '[]');
                if (pidx && processedPayments.includes(pidx)) {
                    console.log("Payment already processed in this session:", pidx);
                    setOrderSuccess(true);
                    setLoading(false);
                    return;
                }
                
                // If this is a Khalti redirect with a successful payment
                if (pidx && status === 'Completed') {
                    // Get the stored order details
                    const storedOrderData = localStorage.getItem('pendingKhaltiOrder');
                    console.log("Raw stored order data:", storedOrderData);
                    
                    // Check if we have data in localStorage
                    let orderDetails;
                    try {
                        if (storedOrderData) {
                            orderDetails = JSON.parse(storedOrderData);

                            // --- PATCH: Overwrite with latest shipping/contact info if available ---
                            const addressData = localStorage.getItem('shippingAddress') || sessionStorage.getItem('shippingAddress');
                            if (addressData) {
                                try {
                                    const parsedAddress = JSON.parse(addressData);
                                    if (parsedAddress.address) {
                                        orderDetails.address = parsedAddress.address.trim();
                                    }
                                    if (parsedAddress.phone) {
                                        orderDetails.contactNumber = parsedAddress.phone.trim();
                                    }
                                } catch (e) {
                                    console.error("Failed to parse shipping address for overwrite:", e);
                                }
                            }
                            // --- END PATCH ---
                        } else {
                            // Fallback: try to get user information from localStorage
                            const user = JSON.parse(localStorage.getItem('user')) || {};
                            
                            // Try to get the cart from multiple sources
                            const cartFromStorage = localStorage.getItem('cart');
                            const cartBackup = localStorage.getItem('cartBackup') || sessionStorage.getItem('cartBackup');
                            
                            let cart = [];
                            if (cartFromStorage) {
                                cart = JSON.parse(cartFromStorage);
                            } else if (cartBackup) {
                                cart = JSON.parse(cartBackup);
                                // Restore the cart if we're using the backup
                                localStorage.setItem('cart', cartBackup);
                            }
                            
                            console.log("No stored order data, using fallback with user:", user._id);
                            console.log("Cart contents:", cart);
                            
                            // Validate cart data
                            if (!cart || cart.length === 0) {
                                console.error("Cart is empty. Cannot proceed with order.");
                                setError("Your cart is empty. Please add items to your cart and try again.");
                                setLoading(false);
                                return;
                            }
                            
                            // Calculate total price from cart
                            const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                            console.log("Total price:", totalPrice);
                            
                            // Get any additional data that might be available
                            const addressData = localStorage.getItem('shippingAddress') || sessionStorage.getItem('shippingAddress');
                            let shippingAddress = "";
                            let contactNum = "";

                            console.log("Raw address data:", addressData);

                            if (addressData) {
                                try {
                                    const parsedAddress = JSON.parse(addressData);
                                    shippingAddress = parsedAddress.address?.trim() || "";
                                    contactNum = parsedAddress.phone?.trim() || "";
                                    console.log("Parsed address from shippingAddress:", shippingAddress);
                                    console.log("Parsed contact number from shippingAddress:", contactNum);
                                } catch (e) {
                                    console.error("Failed to parse shipping address:", e);
                                }
                            }

                            // Do not use URL params, pending order, or prompt. Only use checkout page values.
                            if (!shippingAddress || !contactNum) {
                                setError("Address or contact number missing. Please go back to the checkout page and fill in your shipping details.");
                                setLoading(false);
                                return;
                            }

                            // Create a minimal order payload from available data
                            orderDetails = {
                                customer: user._id,
                                userId: user._id,
                                items: cart.map(item => ({
                                    productId: item._id,
                                    quantity: item.quantity || 1,
                                    price: item.price
                                })),
                                total: totalPrice,
                                totalAmount: totalPrice,
                                fullName: user.fullname || "Guest User",
                                contactNumber: contactNum,
                                address: shippingAddress,
                                paymentMethod: "Khalti"
                            };
                            console.log("Final order details:", orderDetails);
                        }
                        console.log("Order details being sent:", orderDetails);
                    } catch (parseErr) {
                        console.error("Failed to parse or create order details:", parseErr);
                        setError("Failed to process order details. Please contact support.");
                        setLoading(false);
                        return;
                    }
                    
                    // Before verification, save a backup of the cart
                    try {
                        const currentCart = localStorage.getItem('cart');
                        if (currentCart) {
                            localStorage.setItem('cartBackup', currentCart);
                            sessionStorage.setItem('cartBackup', currentCart);
                        }
                    } catch (e) {
                        console.error("Failed to backup cart:", e);
                    }
                    
                    // Verify payment and create order
                    const response = await axios.post('http://localhost:4000/api/khalti/verify', {
                        pidx: pidx,
                        orderPayload: orderDetails
                    });
                    
                    console.log("Verification response:", response.data);
                    
                    if (response.data.success) {
                        setOrderSuccess(true);
                        setOrderId(response.data.order._id);

                        // Clear cart on successful order
                        try {
                            localStorage.removeItem('cart');
                            localStorage.removeItem('cartCount');
                            localStorage.removeItem('cartTotal');
                            localStorage.removeItem('cartBackup');
                            sessionStorage.removeItem('cartBackup');
                            console.log("Cart has been cleared successfully");
                        } catch (clearError) {
                            console.error("Error clearing cart data:", clearError);
                        }

                        // Clear other related data
                        localStorage.removeItem('pendingKhaltiOrder');
                        localStorage.removeItem('khaltiPidx');
                    } else {
                        // If there was an error, remove from processed list to allow retry
                        const index = processedPayments.indexOf(pidx);
                        if (index > -1) {
                            processedPayments.splice(index, 1);
                            localStorage.setItem('processedKhaltiPayments', JSON.stringify(processedPayments));
                        }
                        
                        setError(response.data.message || "Failed to verify payment");
                    }
                } else if (location.state && location.state.orderId) {
                    // Handle regular order confirmation
                    setOrderSuccess(true);
                    setOrderId(location.state.orderId);
                    
                    // Clear cart for regular orders as well
                    localStorage.removeItem('cart');
                } else {
                    console.log("No Khalti params or location state found");
                    setError("No order information available");
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error processing payment:", err);
                setError(err.response?.data?.message || "An error occurred while processing your payment");
                setLoading(false);
            } finally {
                setIsProcessing(false);
            }
        };
        
        processKhaltiPayment();
        
        // Cleanup function to prevent memory leaks
        return () => {
            isFirstLoad = false;
        };
    }, [location, isProcessing]);
    
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="order-confirmation-container">
                    <div className="spinner"></div>
                    <p>Processing your order...</p>
                </div>
                <Footer />
            </>
        );
    }
    
    return (
        <>
            <Navbar />
            <div className="order-confirmation-container">
                {orderSuccess ? (
                    <div className="success-container">
                        <div className="success-icon">
                            <FiCheckCircle size={50} />
                        </div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Thank you for your order.</p>
                        <p>Your order ID: <strong>{orderId}</strong></p>
                        <p>We'll process your order soon and notify you about the status.</p>
                        
                        <div className="action-buttons">
                            <button 
                                className="primary-button" 
                                onClick={() => navigate('/order-history')}
                            >
                                View My Orders
                            </button>
                            <button 
                                className="secondary-button"
                                onClick={() => navigate('/')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="error-container">
                        <div className="error-icon">
                            <FiAlertTriangle size={50} />
                        </div>
                        <h2>Oops! Something went wrong</h2>
                        <p>{error || "We couldn't process your order at this time."}</p>
                        <p>Please try again or contact our support team for assistance.</p>
                        
                        <div className="action-buttons">
                            <button 
                                className="primary-button"
                                onClick={() => navigate(-1)}
                            >
                                Go Back
                            </button>
                            <button 
                                className="secondary-button"
                                onClick={() => navigate('/')}
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderConfirmation;
