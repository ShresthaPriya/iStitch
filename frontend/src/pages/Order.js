import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userMeasurements, setUserMeasurements] = useState(null);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/orders");
        
        if (response.data.success) {
          // Make sure to get the userId field from customer field if it's not directly available
          const ordersWithUserId = response.data.orders.map(order => ({
            ...order,
            userId: order.userId || order.customer // Ensure userId is set even if only customer field exists
          }));
          setOrders(ordersWithUserId);
        } else {
          setError(response.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/orders/${orderId}`, {
        status: newStatus
      });

      if (response.data.success) {
        // Update the orders list with the new status
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // Update selected order if it's the one being changed
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert(response.data.message || "Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setShowMeasurements(false); // Reset measurements view when opening a new order
    setUserMeasurements(null); // Clear previous measurements
    
    // Fetch product details for each item in the order
    try {
      // Create a copy of the order with enhanced items
      const orderWithProductNames = { ...order };
      const enhancedItems = await Promise.all(
        order.items.map(async (item) => {
          try {
            if (item.productId) {
              const productId = typeof item.productId === 'object' 
                ? item.productId._id 
                : item.productId;
              
              console.log(`Fetching product details for ID: ${productId}`);
              
              // Use the correct API endpoint to fetch product details
              const response = await axios.get(`http://localhost:4000/api/items/${productId}`);
              console.log("Product API response:", response.data);
              
              if (response.data && response.data.item) {
                console.log(`Found product name: ${response.data.item.name}`);
                return {
                  ...item,
                  productName: response.data.item.name || 'Product #' + productId.substring(0, 6)
                };
              }
            }
            return { 
              ...item, 
              productName: `Product #${typeof item.productId === 'object' ? item.productId._id.substring(0, 6) : item.productId.substring(0, 6)}` 
            };
          } catch (err) {
            console.error(`Error fetching product details for ID ${item.productId}:`, err);
            return { 
              ...item, 
              productName: `Product #${typeof item.productId === 'object' ? item.productId._id.substring(0, 6) : item.productId.substring(0, 6)}` 
            };
          }
        })
      );
      
      orderWithProductNames.items = enhancedItems;
      setSelectedOrder(orderWithProductNames);
    } catch (err) {
      console.error("Error enhancing order items:", err);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const fetchUserMeasurements = async (userId) => {
    if (!userId) {
      console.error("Cannot fetch measurements: No userId provided");
      alert("User ID not found for this order.");
      return;
    }
    
    try {
      setLoadingMeasurements(true);
      console.log(`Fetching measurements for user ID: ${userId}`);
      
      const response = await axios.get(`http://localhost:4000/api/user-measurements/${userId}`);
      console.log("Measurements API response:", response.data);
      
      if (response.data.success && response.data.measurements && response.data.measurements.length > 0) {
        setUserMeasurements(response.data.measurements);
        setShowMeasurements(true);
      } else {
        console.warn("No measurements found in response:", response.data);
        alert("No measurements found for this user.");
      }
    } catch (err) {
      console.error("Error fetching user measurements:", err);
      alert(`Failed to load user measurements: ${err.message}`);
    } finally {
      setLoadingMeasurements(false);
    }
  };

  const toggleMeasurements = () => {
    if (showMeasurements) {
      // If already showing, just hide them
      setShowMeasurements(false);
    } else {
      // If not showing and no measurements loaded yet, fetch them
      if (!userMeasurements && selectedOrder) {
        const userIdToFetch = selectedOrder.userId || selectedOrder.customer;
        console.log("Attempting to fetch measurements for user:", userIdToFetch);
        fetchUserMeasurements(userIdToFetch);
      } else {
        // If we already have measurements, just show them
        setShowMeasurements(true);
      }
    }
  };

  const getFilteredOrders = () => {
    if (statusFilter === "all") return orders;
    return orders.filter(order => order.status === statusFilter);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Enhanced formatObjectId function to handle more complex object structures
  const formatObjectId = (field) => {
    if (!field) return 'N/A';
    if (typeof field === 'object') {
      // If it's an object with _id property, return the _id
      if (field._id) return String(field._id);
      // Otherwise, stringify the object for safe display
      return JSON.stringify(field);
    }
    // If it's already a string or number, return as is
    return String(field);
  };

  const getPaymentStatus = (order) => {
    // If payment method is Khalti, show "Paid" since Khalti payments are verified immediately
    if (order.paymentMethod === "Khalti") {
      return "Paid";
    }
    // Otherwise return the stored payment status or default to "Pending"
    return order.paymentStatus || "Pending";
  };

  // Function to render measurement value with appropriate units
  const renderMeasurementValue = (value, unit = "inches") => {
    if (!value && value !== 0) return "N/A";
    return `${value} ${unit}`;
  };

  return (
    <div className="admin-content-container">
      <Sidebar />
      <div className="orders-container">
        <h2>Order Management</h2>
        
        <div className="order-filters">
          <label>
            Filter by Status:
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>
        </div>
        
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : getFilteredOrders().length > 0 ? (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredOrders().map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(order._id.length - 6)}</td>
                    <td>{order.fullName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>${(order.total || order.totalAmount).toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn" 
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders">No orders found</div>
        )}

        {selectedOrder && (
          <div className="order-details-modal">
            <div className="modal-content">
              <span className="close-btn" onClick={closeOrderDetails}>&times;</span>
              <h3>Order Details</h3>
              
              <div className="order-detail-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Date Placed:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Total Amount:</strong> ${(selectedOrder.total || selectedOrder.totalAmount).toFixed(2)}</p>
                <p><strong>Status:</strong> 
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </p>
              </div>
              
              <div className="order-detail-section">
                <h4>Customer Information</h4>
                <p><strong>Customer ID:</strong> {formatObjectId(selectedOrder.userId || selectedOrder.customer)}</p>
                <p><strong>Name:</strong> {selectedOrder.fullName}</p>
                <p><strong>Contact Number:</strong> {selectedOrder.contactNumber}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <button 
                  className="view-measurements-btn" 
                  onClick={toggleMeasurements}
                  disabled={loadingMeasurements}
                >
                  {loadingMeasurements 
                    ? "Loading..." 
                    : showMeasurements 
                      ? "Hide Measurements" 
                      : "View Measurements"}
                </button>
              </div>
              
              {/* Measurements section - conditionally rendered */}
              {showMeasurements && (
                <div className="order-detail-section measurements-section">
                  <h4>Customer Measurements</h4>
                  {userMeasurements && userMeasurements.length > 0 ? (
                    <div className="measurements-grid">
                      {userMeasurements.map((measurement, index) => (
                        <div key={index} className="measurement-card">
                          <h5>{measurement.type || "Measurement"} Measurements</h5>
                          <div className="measurement-details">
                            {Object.entries(measurement).map(([key, value]) => {
                              // Skip non-measurement fields
                              if (["_id", "__v", "user", "type", "createdAt", "updatedAt", "unit"].includes(key)) {
                                return null;
                              }
                              return (
                                <p key={key}>
                                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {renderMeasurementValue(value)}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No measurement data found for this customer.</p>
                  )}
                </div>
              )}
              
              <div className="order-detail-section">
                <h4>Payment Information</h4>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {getPaymentStatus(selectedOrder)}</p>
                {selectedOrder.paymentToken && (
                  <p><strong>Payment Token:</strong> {selectedOrder.paymentToken}</p>
                )}
              </div>
              
              <div className="order-detail-section">
                <h4>Order Items</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName || 'Unknown Product'}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedOrder.isCustomOrder && (
                <div className="order-detail-section">
                  <h4>Custom Order Details</h4>
                  <p><strong>Custom Order:</strong> Yes</p>
                  {/* Display custom order details if available */}
                </div>
              )}
              
              <div className="modal-actions">
                <button className="close-modal-btn" onClick={closeOrderDetails}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
