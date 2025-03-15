import React from 'react';
import { NavLink } from "react-router-dom";
import { FaUsers, FaClipboardList, FaBox, FaTags, FaHome, FaBolt, FaRuler, FaPaintBrush } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="logo">iStitch</h1>
      <ul className="menu">
        <li>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaHome className="icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaUsers className="icon" /> Customers
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
          <NavLink to="/admin/subcategories" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaTags className="icon" /> Subcategories
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
          <NavLink to="/admin/designs" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaPaintBrush className="icon" /> Designs
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
