import React from 'react';
import { NavLink } from "react-router-dom";
import { FaUsers, FaClipboardList, FaBox, FaTags, FaHome, FaBolt } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="logo">iStitch</h1>
      <ul className="menu">
        <li>
          <NavLink to="/AdminHome" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaHome className="icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/customer" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaUsers className="icon" /> Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/order" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaClipboardList className="icon" /> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/item" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaBox className="icon" /> Items
          </NavLink>
        </li>
        <li>
          <NavLink to="/category" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaTags className="icon" /> Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/subcategory" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaTags className="icon" /> Subcategories
          </NavLink>
        </li>
        <li>
          <NavLink to="/fabric" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
            <FaBolt className="icon" /> Fabric
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
