import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/Order.css";
import {FaUser} from "react-icons/fa";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userMeasurements, setUserMeasurements] = useState(null);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const ordersWithUserId = response.data.orders.map(order => ({
            ...order,
            userId: order.userId || order.customer
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

  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `/api/orders/${orderId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
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

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `/api/orders/${orderId}`, 
        { paymentStatus: newPaymentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
        ));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
        }
      } else {
        alert(response.data.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      alert("Failed to update payment status. Please try again.");
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setEditingOrder({...order});
    setShowMeasurements(false);
    setUserMeasurements(null);
    setEditMode(false);

    try {
      const orderWithProductNames = { ...order };
      const enhancedItems = await Promise.all(
        order.items.map(async (item) => {
          try {
            // First check if it's a custom order with fabricName
            if (item.customDetails) {
              const fabricName = item.customDetails.fabricName || '';
              const itemType = item.customDetails.itemType || 'Custom Item';
              const style = item.customDetails.style ? ` (${item.customDetails.style})` : '';
              return {
                ...item,
                productName: `${itemType}${style} - ${fabricName}`
              };
            }
            
            // Then try to fetch by productId
            if (item.productId) {
              const productId = typeof item.productId === 'object' ? 
                item.productId._id : item.productId;
              
              console.log("Fetching product details for ID:", productId);
              const token = getAuthToken();
              
              try {
                const response = await axios.get(
                  `/api/items/${productId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );
                
                if (response.data && response.data.item && response.data.item.name) {
                  console.log("Found product:", response.data.item.name);
                  return {
                    ...item,
                    productName: response.data.item.name
                  };
                }
              } catch (fetchError) {
                console.log("Error fetching product, will use fallback name:", fetchError.message);
              }
            }
            
            // If we have a name property directly in the item, use that
            if (item.name) {
              return {
                ...item,
                productName: item.name
              };
            }
            
            // Fallback: create a readable name from what we know
            let fallbackName = "Unknown Product";
            
            // Try to identify product using ID format
            if (item.productId) {
              const idStr = typeof item.productId === 'object' ? 
                (item.productId._id || '').substring(0, 6) : 
                (item.productId || '').substring(0, 6);
              fallbackName = `Product #${idStr}`;
            }
            
            // If we have size, include it in the fallback name
            if (item.size || item.selectedSize) {
              fallbackName += ` (${item.size || item.selectedSize})`;
            }
            
            return {
              ...item,
              productName: fallbackName
            };
          } catch (err) {
            console.error(`Error processing item:`, err);
            return {
              ...item,
              productName: item.name || 'Unknown Product'
            };
          }
        })
      );

      // Log the enhanced items to verify data
      console.log("Enhanced items with product names:", enhancedItems);
      
      orderWithProductNames.items = enhancedItems;
      setSelectedOrder(orderWithProductNames);
    } catch (err) {
      console.error("Error enhancing order items:", err);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setEditMode(false);
    setEditingOrder(null);
  };

  const fetchUserMeasurements = async (userId) => {
    if (!userId) {
      alert("User ID not found for this order.");
      return;
    }

    try {
      setLoadingMeasurements(true);
      const token = getAuthToken();
      const response = await axios.get(`/api/user-measurements/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success && response.data.measurements.length > 0) {
        setUserMeasurements(response.data.measurements);
        setShowMeasurements(true);
      } else {
        alert("No measurements found for this user.");
      }
    } catch (err) {
      alert(`Failed to load measurements: ${err.message}`);
    } finally {
      setLoadingMeasurements(false);
    }
  };

  const toggleMeasurements = () => {
    if (showMeasurements) {
      setShowMeasurements(false);
    } else {
      if (!userMeasurements && selectedOrder) {
        const userIdToFetch = selectedOrder.userId || selectedOrder.customer;
        fetchUserMeasurements(userIdToFetch);
      } else {
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

  const formatObjectId = (field) => {
    if (!field) return 'N/A';
    if (typeof field === 'object') {
      return field._id ? String(field._id) : JSON.stringify(field);
    }
    return String(field);
  };

  const getPaymentStatus = (order) => {
    if (order.paymentMethod === "Khalti") return "Paid";
    return order.paymentStatus || "Pending";
  };

  const renderMeasurementValue = (value, unit = "inches") => {
    if (!value && value !== 0) return "N/A";
    return `${value} ${unit}`;
  };

  const handleEditOrder = (order) => {
    viewOrderDetails(order);
    setEditMode(true);
  };

  const saveOrderChanges = async () => {
    try {
      const updatedData = {
        status: editingOrder.status,
        paymentStatus: editingOrder.paymentStatus,
        address: editingOrder.address,
        contactNumber: editingOrder.contactNumber
      };
      
      const token = getAuthToken();
      const response = await axios.put(
        `/api/orders/${editingOrder._id}`, 
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === editingOrder._id ? {...order, ...updatedData} : order
        ));
        setSelectedOrder({...selectedOrder, ...updatedData});
        setEditMode(false);
        alert("Order updated successfully");
      } else {
        alert(response.data.message || "Failed to update order");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }
    
    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setOrders(orders.filter(order => order._id !== orderId));
        alert("Order deleted successfully");
      } else {
        alert(response.data.message || "Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Process product names similar to admin view
        const order = response.data.order;
        const enhancedItems = await Promise.all(
          order.items.map(async (item) => {
            try {
              // First check if it's a custom order with fabricName
              if (item.customDetails) {
                const fabricName = item.customDetails.fabricName || '';
                const itemType = item.customDetails.itemType || 'Custom Item';
                const style = item.customDetails.style ? ` (${item.customDetails.style})` : '';
                return {
                  ...item,
                  productName: `${itemType}${style} - ${fabricName}`
                };
              }
              
              // Then try to fetch by productId
              if (item.productId) {
                const productId = typeof item.productId === 'object' ? 
                  item.productId._id : item.productId;
                
                try {
                  const response = await axios.get(`/api/items/${productId}`);
                  
                  if (response.data && response.data.item && response.data.item.name) {
                    return {
                      ...item,
                      productName: response.data.item.name
                    };
                  }
                } catch (fetchError) {
                  console.log("Error fetching product, will use fallback name");
                }
              }
              
              // If we have a name property directly in the item, use that
              if (item.name) {
                return {
                  ...item,
                  productName: item.name
                };
              }
              
              // Fallback: create a readable name from what we know
              let fallbackName = "Unknown Product";
              
              if (item.productId) {
                const idStr = typeof item.productId === 'object' ? 
                  (item.productId._id || '').substring(0, 6) : 
                  (item.productId || '').substring(0, 6);
                fallbackName = `Product #${idStr}`;
              }
              
              // If we have size, include it in the fallback name
              if (item.size || item.selectedSize) {
                fallbackName += ` (${item.size || item.selectedSize})`;
              }
              
              return {
                ...item,
                productName: fallbackName
              };
            } catch (err) {
              return {
                ...item,
                productName: item.name || 'Unknown Product'
              };
            }
          })
        );
        
        // Update order with enhanced items
        const enhancedOrder = {
          ...order,
          items: enhancedItems
        };
        
        setSelectedOrder(enhancedOrder);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div className="admin-content-container">
      <Sidebar />
      <div className="main-content">
      <div className="top-bar">
          <h2 className="title">Order Management</h2>
          <div className="user-info">
            <span>Admin</span>
            <FaUser className="icon" />
          </div>
        </div>

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
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredOrders().map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6)}</td>
                    <td>{order.fullName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>Rs. {(order.total || order.totalAmount).toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="operations">
                      <button className="view-btn" title="View" onClick={() => viewOrderDetails(order)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="edit-btn" title="Edit" onClick={() => handleEditOrder(order)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      {/* eslint-disable-next-line no-undef */}
                      <button className="delete-btn" title="Delete" onClick={() => handleDeleteOrder(order._id)}>
                        <i className="fas fa-trash"></i>
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
              <h3>{editMode ? "Edit Order" : "Order Details"}</h3>

              <div className="order-detail-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Date Placed:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Total Amount:</strong> Rs. {(selectedOrder.total || selectedOrder.totalAmount).toFixed(2)}</p>
                <p><strong>Status:</strong>
                  {editMode ? (
                    <select
                      onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                      className="status-dropdown"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  ) : (
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
                  )}
                </p>
              </div>

              <div className="order-detail-section">
                <h4>Customer Information</h4>
                <p><strong>Customer ID:</strong> {formatObjectId(selectedOrder.userId || selectedOrder.customer)}</p>
                <p><strong>Name:</strong> {selectedOrder.fullName}</p>
                <p>
                  <strong>Contact Number:</strong>
                  {editMode ? (
                    <input
                      type="text"
                      value={editingOrder.contactNumber}
                      onChange={(e) => setEditingOrder({...editingOrder, contactNumber: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    selectedOrder.contactNumber
                  )}
                </p>
                <p>
                  <strong>Address:</strong>
                  {editMode ? (
                    <input
                      type="text"
                      value={editingOrder.address}
                      onChange={(e) => setEditingOrder({...editingOrder, address: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    selectedOrder.address
                  )}
                </p>
                {!editMode && (
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
                )}
              </div>

              {/* Measurements section - only show in view mode */}
              {!editMode && showMeasurements && userMeasurements && (
                <div className="order-detail-section measurements-section">
                  <h4>Customer Measurements</h4>
                  <div className="measurements-grid">
                    {userMeasurements.map((measurement, index) => (
                      <div key={index} className="measurement-card">
                        <h5>{measurement.type || "Measurement"} Measurements</h5>
                        <div className="measurement-details">
                          {Object.entries(measurement).map(([key, value]) => {
                            if (["_id", "__v", "user", "type", "createdAt", "updatedAt", "unit"].includes(key)) return null;
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
                </div>
              )}

              <div className="order-detail-section">
                <h4>Payment Information</h4>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                {selectedOrder.paymentMethod === "Cash On Delivery" && (
                  <p><strong>Payment Status:</strong>
                    {editMode ? (
                      <select
                        value={editingOrder.paymentStatus || "Pending"}
                        onChange={(e) => setEditingOrder({...editingOrder, paymentStatus: e.target.value})}
                        className="status-dropdown"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    ) : (
                      <select
                        value={selectedOrder.paymentStatus || "Pending"}
                        onChange={(e) => handlePaymentStatusChange(selectedOrder._id, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    )}
                  </p>
                )}
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
                        <td>
                          {item.productName || 'Unknown Product'}
                          {item.customDetails && (
                            <div className="custom-details">
                              {item.customDetails.itemType && (
                                <span className="custom-item-type">
                                  Item: {item.customDetails.itemType}
                                </span>
                              )}
                              {item.customDetails.style && (
                                <span className="custom-item-style">
                                  Style: {item.customDetails.style}
                                </span>
                              )}
                              {item.customDetails.additionalStyling && (
                                <div className="custom-item-notes">
                                  <strong>Notes:</strong> {item.customDetails.additionalStyling}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{item.quantity}</td>
                        <td>Rs. {item.price.toFixed(2)}</td>
                        <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                {editMode ? (
                  <>
                    <button className="save-btn" onClick={saveOrderChanges}>Save Changes</button>
                    <button className="cancel-btn" onClick={() => {setEditMode(false); setEditingOrder({...selectedOrder});}}>Cancel</button>
                  </>
                ) : (
                  <button className="close-modal-btn" onClick={closeOrderDetails}>Close</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;