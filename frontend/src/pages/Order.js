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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("Fetching orders from API...");
        const response = await axios.get("http://localhost:4000/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log("API response:", response.data);
        
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/orders/${orderId}`, {
        status: newStatus
      });

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
      const response = await axios.put(`http://localhost:4000/api/orders/${orderId}`, {
        paymentStatus: newPaymentStatus
      });

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
    setShowMeasurements(false);
    setUserMeasurements(null);

    try {
      const orderWithProductNames = { ...order };
      const enhancedItems = await Promise.all(
        order.items.map(async (item) => {
          try {
            if (item.productId) {
              const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
              const response = await axios.get(`http://localhost:4000/api/items/${productId}`);
              if (response.data && response.data.item) {
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
            console.error(`Error fetching product ${item.productId}:`, err);
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
      alert("User ID not found for this order.");
      return;
    }

    try {
      setLoadingMeasurements(true);
      const response = await axios.get(`http://localhost:4000/api/user-measurements/${userId}`);
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

  // Delete order handler
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
      if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert("Failed to delete order. Please try again.");
    }
  };

  // Open edit modal
  const handleEditOrder = (order) => {
    setEditOrder({ ...order });
    setEditModalOpen(true);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited order
  const handleSaveEdit = async () => {
    try {
      const { _id, status, paymentStatus, address, contactNumber } = editOrder;
      await axios.put(
        `http://localhost:4000/api/orders/${_id}`,
        { status, paymentStatus, address, contactNumber }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === _id
            ? { ...order, status, paymentStatus, address, contactNumber }
            : order
        )
      );
      setEditModalOpen(false);
      setEditOrder(null);
      if (selectedOrder && selectedOrder._id === _id) {
        setSelectedOrder({ ...selectedOrder, status, paymentStatus, address, contactNumber });
      }
    } catch (err) {
      alert("Failed to update order. Please try again.");
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
                  <th>Actions</th>
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
                    <td>
                      <button className="view-btn" onClick={() => viewOrderDetails(order)}>
                        View Details
                      </button>
                      <button
                        className="edit-btn"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        Delete
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
                <p><strong>Total Amount:</strong> Rs. {(selectedOrder.total || selectedOrder.totalAmount).toFixed(2)}</p>
                {/* Status field removed */}
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

              {showMeasurements && userMeasurements && (
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
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedOrder.paymentMethod === "Khalti"
                    ? "Paid"
                    : (selectedOrder.paymentStatus || "Pending")}
                </p>
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
                        <td>Rs. {item.price.toFixed(2)}</td>
                        <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button className="close-modal-btn" onClick={closeOrderDetails}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal - Status and Payment Status fields removed */}
        {editModalOpen && editOrder && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Order</h3>
              {/* Add status dropdown */}
              <label>Status:</label>
              <select
                name="status"
                value={editOrder.status}
                onChange={handleEditChange}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              {/* Payment Status logic */}
              <label>Payment Status:</label>
              {editOrder.paymentMethod === "Khalti" ? (
                <input
                  type="text"
                  name="paymentStatus"
                  value="Paid"
                  disabled
                  style={{ background: "#eee", color: "#333" }}
                />
              ) : (
                <select
                  name="paymentStatus"
                  value={editOrder.paymentStatus || "Pending"}
                  onChange={handleEditChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              )}
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                value={editOrder.contactNumber || ""}
                onChange={handleEditChange}
              />
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={editOrder.address || ""}
                onChange={handleEditChange}
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleSaveEdit}>Save</button>
                <button className="cancel-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
