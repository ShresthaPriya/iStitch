import { useState } from "react";
import { FaUser, FaCog, FaUsersCog, FaListAlt, FaClipboardList, FaShoppingBag, FaBox } from "react-icons/fa";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";

const AdminHome = () => {
    const [username] = useState("Admin");

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
                    <div className="metric-card">
                        <FaUsersCog className="metric-icon users" />
                        <span className="metric-title">Customers</span>
                        <span className="metric-value">xxx</span>
                    </div>
                    <div className="metric-card">
                        <FaListAlt className="metric-icon pending-orders" />
                        <span className="metric-title">Pending Orders</span>
                        <span className="metric-value">xxx</span>
                    </div>
                    <div className="metric-card">
                        <FaClipboardList className="metric-icon orders" />
                        <span className="metric-title">Total Orders</span>
                        <span className="metric-value">xxx</span>
                    </div>
                    <div className="metric-card">
                        <FaShoppingBag className="metric-icon sales" />
                        <span className="metric-title">Total Sales</span>
                        <span className="metric-value">xxx</span>
                    </div>
                    <div className="metric-card">
                        <FaBox className="metric-icon items" />
                        <span className="metric-title">Total Items</span>
                        <span className="metric-value">xxx</span>
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
