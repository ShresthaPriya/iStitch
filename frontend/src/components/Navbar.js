import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; 
import Items from "./Items";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppContext } from "../App";

function Navbar() {
  const { username } = useContext(AppContext);
  const [menuActive, setMenuActive] = useState(false);
  const [shopDropdownActive, setShopDropdownActive] = useState(false);
  const [menDropdownActive, setMenDropdownActive] = useState(false);
  const [womenDropdownActive, setWomenDropdownActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const toggleShopDropdown = () => {
    setShopDropdownActive(!shopDropdownActive);
  };

  const toggleMenDropdown = () => {
    setMenDropdownActive(!menDropdownActive);
  };

  const toggleWomenDropdown = () => {
    setWomenDropdownActive(!womenDropdownActive);
  };

  const navigateToShirts = () => {
    navigate('/shop/men/shirt');
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
        <li className="dropdown">
          <Link to="#" onClick={toggleShopDropdown}>Shop <i className="fa fa-chevron-down"></i></Link>
          {shopDropdownActive && (
            <ul className="dropdown-menu wide-dropdown">
              <li className="dropdown">
                <Link to="#" onClick={toggleMenDropdown}>Men Wear <i className="fa fa-chevron-right"></i></Link>
                {menDropdownActive && (
                  <ul className="dropdown-menu wide-dropdown">
                    {/* <li><Link to="#" onClick={navigateToShirts}>Shirt</Link></li> */}
                    <li><Link to="/Items">Shirt</Link></li>
                    <li><Link to="/shop/men/pant">Pant</Link></li>
                    <li><Link to="/shop/men/suit">Suit</Link></li>
                    <li><Link to="/shop/men/tshirt">T-Shirt</Link></li>
                  </ul>
                )}
              </li>
              <li className="dropdown">
                <Link to="#" onClick={toggleWomenDropdown}>Women Wear <i className="fa fa-chevron-right"></i></Link>
                {womenDropdownActive && (
                  <ul className="dropdown-menu wide-dropdown">
                    <li><Link to="/shop/women/blouse">Blouse</Link></li>
                    <li><Link to="/shop/women/kurta">Kurta</Link></li>
                    <li><Link to="/shop/women/pants">Pants</Link></li>
                    <li><Link to="/shop/women/blazer">Blazer</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>
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


