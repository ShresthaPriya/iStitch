import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppContext } from "../App";

function Navbar() {
  const { username } = useContext(AppContext);
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <h1>
          <Link to="/home" className="logo-link">iStitch</Link>
        </h1>
      </div>

      {/* Menu Toggle Button */}
      <div className="menu-toggle" onClick={toggleMenu}>
        <i className={menuActive ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/fabric">Fabric</Link></li>
        <li><Link to="/measurement">Measurements</Link></li>
      </ul>

      {/* Search and Profile Section */}
      <div className="search-and-profile">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for recipes..." 
            className="search-input" 
          />
          <button className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="notification-section">
          <button className="notification-button">
            <i className="fa fa-bell"></i>
            <span className="notification-badge">5</span> {/* Example badge for notifications */}
          </button>
        </div>
        <div className="cart-section">
          <button className="cart-button">
            <i className="fa fa-shopping-cart"></i>
            <span className="cart-badge">3</span> {/* Example badge for cart count */}
          </button>
        </div>

        <div className="profile-section">
          <button className="profile-button">
            <Link to="/login">
              <i className="fa-solid fa-user"></i>
            </Link>
            {username && <span className="profile-badge">1</span>} {/* Example badge for profile */}
          </button>
          {username && (
            <div className="username-dropdown">
              <i className="fa fa-chevron-down dropdown-icon"></i>
              {/* Add dropdown for profile */}
              <ul className="dropdown-menu">
                <li><Link to="/profile">Profile</Link></li>
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


