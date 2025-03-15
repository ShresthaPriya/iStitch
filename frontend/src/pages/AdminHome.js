import { useState, useEffect } from "react";
import { FaUser, FaCog, FaUsersCog, FaListAlt, FaClipboardList, FaShoppingBag, FaBox } from "react-icons/fa";
import axios from "axios";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";

const AdminHome = () => {
    const [username] = useState("Admin");
    const [metrics, setMetrics] = useState({
        customerCount: 0,
        pendingOrderCount: 0,
        totalOrderCount: 0,
        totalSales: 0,
        totalItemCount: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/metrics');
                setMetrics(response.data.metrics);
            } catch (err) {
                console.error("Error fetching metrics:", err);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar /> {/* Sidebar is inside the flex container */}
            <div className="main-content">
                {/* Top Bar */}
                <div className="top-bar">
                    <h2 className="title">Dashboard</h2>
                    <div className="user-info">
                        <span>{username}</span>
                        <FaCog className="icon" />
                        <FaUser className="icon" />
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="metrics-grid">
    <div className="metric-card customers">
        <FaUsersCog className="metric-icon" />
        <span className="metric-title">Customers</span>
        <span className="metric-value">{metrics.customerCount}</span>
    </div>
    <div className="metric-card pending-orders">
        <FaListAlt className="metric-icon" />
        <span className="metric-title">Pending Orders</span>
        <span className="metric-value">{metrics.pendingOrderCount}</span>
    </div>
    <div className="metric-card total-orders">
        <FaClipboardList className="metric-icon" />
        <span className="metric-title">Total Orders</span>
        <span className="metric-value">{metrics.totalOrderCount}</span>
    </div>
    <div className="metric-card total-sales">
        <FaShoppingBag className="metric-icon" />
        <span className="metric-title">Total Sales</span>
        <span className="metric-value">${metrics.totalSales.toFixed(2)}</span>
    </div>
    <div className="metric-card total-items">
        <FaBox className="metric-icon" />
        <span className="metric-title">Total Items</span>
        <span className="metric-value">{metrics.totalItemCount}</span>
    </div>
</div>


                {/* Top-Selling Products Section */}
                <div className="top-selling-products">
                    <h3 className="section-title">Top Selling Products</h3>
                    <div className="product-grid">
                        <div className="product-card">
                            <img src={require('../images/items/shirts/Shirt1.jpg')} alt="Shirt" className="product-name" />
                            <span className="product-name">Wrinkle-Resistant Shirt</span>
                        </div>
                        <div className="product-card">
                            <img src={require('../images/items/shirts/shirt2.jpg')} alt="Shirt" className="product-name" />
                            <span className="product-name">Plain Navy Blue Shirt</span>
                        </div>
                        <div className="product-card">
                            <img src={require('../images/items/shirts/shirt3.jpg')} alt="Shirt" className="product-name" />
                            <span className="product-name">Non-Iron Stretch Shirt</span>
                        </div>
                        <div className="product-card">
                            <img src={require('../images/items/shirts/shirt4.jpg')} alt="Shirt" className="product-name" />
                            <span className="product-name">Non-Iron Stretch Shirt</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
