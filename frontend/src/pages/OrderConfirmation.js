import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
    const [status, setStatus] = useState('pending'); // Default status is 'pending'
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, clearCart, calculateTotal } = useContext(CartContext);
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user details
    const [isVerified, setIsVerified] = useState(false); // Prevent repeated requests

useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pidx = query.get('pidx');
    const transactionStatus = query.get('status');

    console.log("Query params:", { pidx, status: transactionStatus });
    console.log("Cart contents:", cart);
    console.log("Total price:", calculateTotal());

    const verifyPayment = async () => {
        if (!pidx || isVerified) {
            return; // Prevent repeated requests
        }

        try {
            setStatus('verifying');
            console.log("Verifying payment with pidx:", pidx);

            // Get the cart data from localStorage as a backup if context is empty
            let cartItems = cart;
            let cartTotal = calculateTotal();
            
            // If cart is empty (might happen on page refresh), try to get from localStorage
            if (!cartItems || cartItems.length === 0) {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    try {
                        cartItems = JSON.parse(savedCart);
                        console.log("Retrieved cart from localStorage:", cartItems);
                        
                        // Calculate total manually if needed
                        cartTotal = cartItems.reduce((total, item) => {
                            return total + (item.price * (item.quantity || 1));
                        }, 0);
                    } catch (e) {
                        console.error("Error parsing cart from localStorage:", e);
                    }
                }
            }

            const orderPayload = {
                customer: user._id,
                items: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity || 1,
                    size: item.selectedSize,
                    price: Number(item.price)
                })),
                total: Number(cartTotal), // Add total field
                totalAmount: Number(cartTotal),
                fullName: user.fullname || "N/A",
                contactNumber: localStorage.getItem("checkoutPhone") || "",
                address: localStorage.getItem("checkoutAddress") || "",
                paymentMethod: "Cash On Delivery" // Ensure COD is set
            };

            console.log("Sending order payload:", JSON.stringify(orderPayload, null, 2));

            // Check if there are items in the order
            if (!orderPayload.items || orderPayload.items.length === 0) {
                console.error("Order items array is empty!");
                setStatus('failed');
                setError('No items in cart. Order cannot be processed.');
                return;
            }

            // Handle Cash on Delivery (No need to verify payment)
            if (orderPayload.paymentMethod === "Cash On Delivery") {
                setStatus('success');
                setOrderDetails({
                    transaction_id: "COD-" + Date.now(),
                    total_amount: orderPayload.totalAmount
                });

                // Clear cart from localStorage and context only after successful order save
                localStorage.removeItem('cart');
                clearCart();

                setIsVerified(true); // Mark as verified to prevent repeated requests
                return;
            }

            // For digital payment (e.g., Khalti), verify the payment if pidx is valid
            if (pidx) {
                const verifyResponse = await axios.post('http://localhost:4000/api/khalti/verify', { 
                    pidx, 
                    orderPayload
                });
                
                console.log("Verification response:", verifyResponse.data);

                if (verifyResponse.data.success) {
                    setOrderDetails(verifyResponse.data.order);

                    // Clear cart from localStorage and context only after successful order save
                    localStorage.removeItem('cart');
                    clearCart();

                    setStatus('success');
                    setIsVerified(true); // Mark as verified to prevent repeated requests
                } else {
                    setStatus('failed');
                    setError('Payment verification failed: ' + verifyResponse.data.message);
                }
            } else {
                setStatus('success');
                setOrderDetails({
                    transaction_id: "COD-" + Date.now(),
                    total_amount: orderPayload.totalAmount
                });

                // Clear cart from localStorage and context only after successful order save
                localStorage.removeItem('cart');
                clearCart();

                setIsVerified(true);
            }
        } catch (err) {
            console.error('Error verifying payment:', err);
            setStatus('failed');
            setError(err.response?.data?.message || 'Payment verification failed');
        }
    };

    // If user canceled, handle accordingly
    if (transactionStatus === 'User canceled') {
        setStatus('canceled');
        setError('Payment was canceled by the user');
    } else {
        verifyPayment();
    }
}, [location, clearCart, cart, user, calculateTotal, isVerified]);


    return (
        <>
            <Navbar />
            <div className="order-confirmation-container">
                <h1>Order Confirmation</h1>

                {status === 'pending' && (
                    <div className="pending-message">
                        <p>Your order is pending. Please wait while we process it.</p>
                    </div>
                )}

                {status === 'verifying' && (
                    <div className="verifying-message">
                        <div className="spinner"></div>
                        <p>Verifying your payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h2>Payment Successful!</h2>
                        <p>Your order has been confirmed and is being processed.</p>
                        {orderDetails && (
                            <div className="order-info">
                                <p><strong>Transaction ID:</strong> {orderDetails.transaction_id}</p>
                                <p><strong>Amount:</strong> Rs. {orderDetails.total_amount / 100}</p>
                            </div>
                        )}
                        <button
                            className="view-orders-btn"
                            onClick={() => navigate('/order-history')}
                        >
                            View My Orders
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="error-message">
                        <div className="error-icon">✗</div>
                        <h2>Payment Failed</h2>
                        <p>{error || 'There was an error processing your payment.'}</p>
                        <button
                            className="try-again-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {status === 'canceled' && (
                    <div className="canceled-message">
                        <h2>Payment Canceled</h2>
                        <p>You canceled the payment process.</p>
                        <button
                            className="try-again-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Return to Checkout
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderConfirmation;
