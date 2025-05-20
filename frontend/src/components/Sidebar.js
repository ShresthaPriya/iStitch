import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { FaUsers, FaClipboardList, FaBox, FaTags, FaHome, FaBolt, FaRuler, FaSignOutAlt } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    setShowLogoutConfirm(false);
    navigate('/admin/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="sidebar">
      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="logout-confirm-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-confirm-buttons">
              <button onClick={confirmLogout} className="confirm-button">Yes, Logout</button>
              <button onClick={cancelLogout} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <h1 className="logo">iStitch</h1>
      <ul className="menu">
        <li>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaHome className="icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaClipboardList className="icon" /> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaBox className="icon" /> Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaTags className="icon" /> Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/fabrics" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaBolt className="icon" /> Fabrics
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/measurements" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaRuler className="icon" /> Body Measurements
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaUsers className="icon" /> Users
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
