import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import "../styles/AdminOrders.css";
import axios from "axios";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editOrder, setEditOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setOrders(response.data.orders || []); // Ensure orders is always an array
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to fetch orders. Please try again.");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getOrderTotal = (order) => {
        const amount = order.totalAmount || order.total || 0;
        return parseFloat(amount).toFixed(2);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(
                `/api/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Failed to update order status. Please try again.");
        }
    };

    const handleViewMeasurements = async (userId) => {
        try {
            const response = await axios.get(
                `/api/measurements/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert(JSON.stringify(response.data.measurements, null, 2)); // Display measurements in an alert for now
        } catch (err) {
            console.error("Error fetching measurements:", err);
            alert("Failed to fetch measurements. Please try again.");
        }
    };

    // Delete order handler
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            await axios.delete(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
        } catch (err) {
            console.error("Error deleting order:", err);
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
                `/api/orders/${_id}`,
                { status, paymentStatus, address, contactNumber },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
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
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Failed to update order. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-content">
                <h2>Admin Orders</h2>
                <div style={{ overflowX: "auto" }}>
                    <table className="admin-orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Contact Number</th>
                                <th>Address</th>
                                <th>Items</th>
                                <th>Total Amount</th>
                                <th>Payment Method</th>
                                <th>Order Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id?.substring(order._id.length - 6) || "N/A"}</td>
                                    <td>{order.fullName || order.customer?.fullName || "N/A"}</td>
                                    <td>{order.contactNumber || order.customer?.contactNumber || "N/A"}</td>
                                    <td>{order.address || order.customer?.address || "N/A"}</td>
                                    <td>
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="order-item-row">
                                                {item.productId?.name || "Custom Item"} 
                                                {item.customDetails?.itemType && (
                                                    <div className="fabric-detail">
                                                        <strong>Item Type:</strong> {item.customDetails.itemType}
                                                        {item.customDetails.style && (
                                                            <span> - <strong>Style:</strong> {item.customDetails.style}</span>
                                                        )}
                                                        {item.customDetails.fabricName && (
                                                            <div><strong>Fabric:</strong> {item.customDetails.fabricName}</div>
                                                        )}
                                                        {item.customDetails.additionalStyling && (
                                                            <div className="additional-styling">
                                                                <strong>Additional Instructions:</strong> {item.customDetails.additionalStyling}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {!item.customDetails && item.size && <span> - Size: {item.size}</span>}
                                                <span className="item-quantity">(x{item.quantity})</span>
                                            </div>
                                        )) || "N/A"}
                                    </td>
                                    <td>${getOrderTotal(order)}</td>
                                    <td>{order.paymentMethod || "N/A"}</td>
                                    <td>{order.isCustomOrder ? "Custom Order" : "Standard Order"}</td>
                                    <td>
                                        <select
                                            value={order.status || "N/A"}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`status-select status-${order.status?.toLowerCase() || "unknown"}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEditOrder(order)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteOrder(order._id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="view-measurements-btn"
                                                onClick={() => handleViewMeasurements(order.userId)}
                                            >
                                                View Measurements
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Edit Order Modal */}
                {editModalOpen && editOrder && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Edit Order</h3>
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
                            <label>Payment Status:</label>
                            <select
                                name="paymentStatus"
                                value={editOrder.paymentStatus || "Pending"}
                                onChange={handleEditChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                            </select>
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

export default AdminOrders;