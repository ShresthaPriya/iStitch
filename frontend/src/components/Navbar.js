import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; 
import { AppContext } from "../App";

function Navbar() {
  const { username } = useContext(AppContext);

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <h1>
          <Link to="/home" className="logo-link">Bon Appétit</Link>
        </h1>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li>
          <Categories /> {/* Dropdown Categories */}
        </li>
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

        <div className="profile-section">
          <div className="profile-icon">
            <i className="fa-solid fa-user"></i>
          </div>
          {username ? (
            <div className="username-dropdown">
              <span>{fullname}</span>
              <i className="fa fa-chevron-down dropdown-icon"></i>
              {/* Add dropdown for profile */}
              <ul className="dropdown-menu">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
