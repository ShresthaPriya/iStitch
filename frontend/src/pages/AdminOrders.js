import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import "../styles/AdminOrders.css";
import axios from "axios";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:4000/api/orders", {
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
                `http://localhost:4000/api/orders/${orderId}`,
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
                `http://localhost:4000/api/measurements/${userId}`,
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
                                            {item.customDetails?.itemType && ` (${item.customDetails.itemType})`}
                                            {item.size && ` - Size: ${item.size}`}
                                            (x{item.quantity})
                                            {item.customDetails?.fabricName && 
                                                <div className="fabric-detail">Fabric: {item.customDetails.fabricName}</div>
                                            }
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
                                    <button
                                        className="delete-btn"
                                        onClick={() => alert("Delete functionality not implemented yet.")}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="view-measurements-btn"
                                        onClick={() => handleViewMeasurements(order.userId)}
                                    >
                                        View Measurements
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;