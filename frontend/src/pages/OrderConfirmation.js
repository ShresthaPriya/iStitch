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
                    
                    // Try to retrieve stored order data
                    let orderDetails;
                    let orderItems;

                    if (storedOrderData) {
                      try {
                        orderDetails = JSON.parse(storedOrderData);
                        orderItems = orderDetails.items;
                      } catch (e) {
                        console.error("Error parsing stored order data:", e);
                      }
                    }

                    // If no stored order data or items, try to use cart backup
                    if (!orderDetails || !orderItems || orderItems.length === 0) {
                      const backupCart = localStorage.getItem('khaltiCartBackup');
                      if (backupCart) {
                        try {
                          const parsedBackupCart = JSON.parse(backupCart);
                          if (parsedBackupCart.length > 0) {
                            orderItems = parsedBackupCart;
                          } else {
                            setError("Payment was successful, but order data was lost. Please contact support.");
                            return;
                          }
                        } catch (e) {
                          setError("Payment was successful, but order data was lost. Please contact support.");
                          return;
                        }
                      } else {
                        setError("Payment was successful, but order data was lost. Please contact support.");
                        return;
                      }

                      // Rebuild orderDetails from backupCart and user info
                      const user = JSON.parse(localStorage.getItem('user'));
                      const addressData = localStorage.getItem('userAddress');
                      let address = '', contactNumber = '';
                      if (addressData) {
                        try {
                          const parsedAddress = JSON.parse(addressData);
                          address = parsedAddress.address || '';
                          contactNumber = parsedAddress.phone || '';
                        } catch {}
                      }
                      const totalPrice = orderItems.reduce(
                        (total, item) => total + item.price * (item.quantity || 1),
                        0
                      );
                      orderDetails = {
                        userId: user?._id,
                        customer: user?._id,
                        items: orderItems.map(item => ({
                          productId: item._id,
                          quantity: item.quantity || 1,
                          price: item.price,
                          size: item.size || 'default'
                        })),
                        totalAmount: totalPrice,
                        paymentMethod: 'Khalti',
                        paymentToken: queryParams.pidx,
                        status: 'Pending',
                        fullName: user?.fullname || 'Unknown',
                        contactNumber,
                        address
                      };
                    }
                    
                    console.log("Final order details:", orderDetails);
                    
                    // Add the payment to processed list BEFORE sending the request to avoid double processing
                    processedPayments.push(pidx);
                    localStorage.setItem('processedKhaltiPayments', JSON.stringify(processedPayments));
                    
                    // Verify payment and create order
                    const response = await axios.post('http://localhost:4000/api/orders', orderDetails);
                    
                    console.log("Verification response:", response.data);
                    
                    if (response.data.success) {
                        setOrderSuccess(true);
                        setOrderId(response.data.order._id);
                        
                        // Clear cart on successful order
                        try {
                            localStorage.removeItem('cart');
                            localStorage.removeItem('cartCount');
                            localStorage.removeItem('cartTotal');
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
                                onClick={() => navigate('/home')}
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
