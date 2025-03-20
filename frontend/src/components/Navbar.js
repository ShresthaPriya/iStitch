import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppContext } from "../App";

function Navbar() {
  const { username } = useContext(AppContext);
  const [menuActive, setMenuActive] = useState(false);
  const [profileDropdownActive, setProfileDropdownActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownActive(!profileDropdownActive);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>
          <Link to="/home" className="logo-link">iStitch</Link>
        </h1>
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <i className={menuActive ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/mens">Men's</Link></li>
        <li><Link to="/women">Women's</Link></li>
        <li><Link to="/fabric-collection">Fabrics</Link></li>
        <li><Link to="/customer-measurements">Enter Measurements</Link></li>
      </ul>

      <div className="search-and-profile">
        <div className="search-bar">
          <input type="text" className="search-input" />
          <button className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="notification-section">
          <button className="notification-button">
            <i className="fa fa-bell"></i>
            <span className="notification-badge">5</span>
          </button>
        </div>
        <div className="cart-section">
          <button className="cart-button">
            <i className="fa fa-shopping-cart"></i>
            <span className="cart-badge">3</span>
          </button>
        </div>

        <div className="profile-section">
          <button className="profile-button" onClick={toggleProfileDropdown}>
            <i className="fa-solid fa-user"></i>
            {username && <span className="profile-badge">1</span>}
          </button>
          {username && profileDropdownActive && (
            <div className="username-dropdown">
              <i className="fa fa-chevron-down dropdown-icon"></i>
              <ul className="dropdown-menu">
                <li><Link to="/order-history">Order History</Link></li>
                <li><Link to="/saved-measurements">Saved Measurements</Link></li>
                <li><Link to="/manage-account">Manage Account</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
