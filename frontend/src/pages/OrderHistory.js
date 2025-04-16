import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/OrderHistory.css";
import axios from "axios";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    const navigate = useNavigate();

    // New state to track enhanced orders with product names
    const [enhancedOrders, setEnhancedOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!userId) {
                    console.error("User ID not found in localStorage");
                    setError("Please log in to view your order history");
                    setLoading(false);
                    return;
                }

                console.log("Fetching orders for user:", userId);
                
                // Set a reasonable timeout
                const response = await axios.get(`http://localhost:4000/api/orders/${userId}`, {
                    timeout: 10000 // 10 second timeout
                });
                
                console.log("Order API response:", response.data);
                
                if (response.data.success && Array.isArray(response.data.orders)) {
                    setOrders(response.data.orders);
                    console.log("Orders retrieved:", response.data.orders.length);
                    
                    // Enhance orders with product names
                    enhanceOrdersWithProductNames(response.data.orders);
                } else {
                    console.warn("No orders found or invalid response format");
                    setOrders([]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                
                // Provide more detailed error message
                let errorMessage = "Failed to fetch orders";
                if (err.response) {
                    console.error("Error response:", err.response.data);
                    errorMessage += `: ${err.response.data.message || err.response.statusText}`;
                } else if (err.request) {
                    errorMessage += ": No response from server. Please check your connection.";
                } else {
                    errorMessage += `: ${err.message}`;
                }
                
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    // Function to enhance orders with product names
    const enhanceOrdersWithProductNames = async (orders) => {
        try {
            const ordersWithProducts = await Promise.all(
                orders.map(async (order) => {
                    const enhancedItems = await Promise.all(
                        order.items.map(async (item) => {
                            try {
                                if (item.productId) {
                                    const productId = typeof item.productId === 'object' 
                                        ? item.productId._id 
                                        : item.productId;
                                    
                                    const response = await axios.get(`http://localhost:4000/api/items/${productId}`);
                                    if (response.data && response.data.item) {
                                        return {
                                            ...item,
                                            productName: response.data.item.name || `Product #${productId.substring(0, 6)}`
                                        };
                                    }
                                }
                                return { 
                                    ...item, 
                                    productName: 'Unknown Product' 
                                };
                            } catch (err) {
                                console.error("Error fetching product details:", err);
                                return { ...item, productName: 'Unknown Product' };
                            }
                        })
                    );
                    
                    return {
                        ...order,
                        items: enhancedItems
                    };
                })
            );
            
            setEnhancedOrders(ordersWithProducts);
        } catch (err) {
            console.error("Error enhancing orders with product names:", err);
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to get status class for styling
    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered': return 'status-delivered';
            case 'Shipped': return 'status-shipped';
            case 'Processing': return 'status-processing';
            case 'Pending': 
            default: return 'status-pending';
        }
    };

    return (
        <>
            <Navbar />
            <div className="order-history-page">
                <h2>Order History</h2>
                {loading ? (
                    <div className="loading">Loading orders...</div>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="shop-now-btn">Try Again</button>
                    </div>
                ) : (enhancedOrders.length > 0 || orders.length > 0) ? (
                    <div className="orders-container">
                        {(enhancedOrders.length > 0 ? enhancedOrders : orders).map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order._id.substring(order._id.length - 6)}</h3>
                                        <span className="order-date">Placed on {formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className={`order-status ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="order-details">
                                    <div className="order-items">
                                        <h4>Items</h4>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <span>{item.quantity}x {item.productName || 'Item'}</span>
                                                <span>Rs. {item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-info">
                                        <div className="order-info-group">
                                            <h4>Shipping Details</h4>
                                            <p>{order.fullName}</p>
                                            <p>{order.contactNumber}</p>
                                            <p>{order.address}</p>
                                        </div>

                                        <div className="order-info-group">
                                            <h4>Payment Method</h4>
                                            <p>{order.paymentMethod}</p>
                                        </div>

                                        <div className="order-summary">
                                            <h4>Order Summary</h4>
                                            <div className="summary-row">
                                                <span>Total Amount:</span>
                                                <span className="total-amount">Rs. {(order.totalAmount || order.total || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-orders">
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/home')} className="shop-now-btn">Shop Now</button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderHistory;
