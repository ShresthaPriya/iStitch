import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from "axios";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/orders");
                setOrders(response.data.orders);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await axios.put(`http://localhost:4000/api/orders/${orderId}`, { status });
            setOrders(orders.map(order => order._id === orderId ? { ...order, status } : order));
        } catch (err) {
            console.error("Error updating order status:", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="admin-orders-page">
                <h2>Admin Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Address</th>
                            <th>Measurements</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.fullName}</td>
                                <td>{order.address}</td>
                                <td>{order.measurements || "Blank"}</td> {/* Display "Blank" if measurements are not provided */}
                                <td>${order.total.toFixed(2)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

export default AdminOrders;
