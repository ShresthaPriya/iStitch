import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppContext } from "../App";
import { CartContext } from '../context/CartContext';

function SplashNavbar({ onCartClick }) {
  const { username } = useContext(AppContext);
  const { cart } = useContext(CartContext);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "http://localhost:3000/splash-home";
  };

  const handleProfileClick = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>
          <Link to="/splash-home" className="logo-link">iStitch</Link>
        </h1>
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <i className={menuActive ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li><Link to="/splash-home">Home</Link></li>
        <li><Link to="/splash-mens">Men's</Link></li>
        <li><Link to="/splash-womens">Women's</Link></li>
        <li><Link to="/splash-fabric-collection">Fabrics</Link></li>
      </ul>

      <div className="search-and-profile">
        <div className="search-bar">
          <input type="text" className="search-input" />
          <button className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </div>

        <div className="profile-section">
          <button className="profile-button" onClick={handleProfileClick}>
            <i className="fa-solid fa-user"></i>
            {username && <span className="profile-badge">1</span>}
          </button>
          {profileDropdownActive && (
            <div className="username-dropdown">
              <i className="fa fa-chevron-down dropdown-icon"></i>
              <ul className="dropdown-menu">
                <li><Link to="/user-profile">Profile Setting</Link></li>
                <li><Link to="/order-history">Order History</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SplashNavbar;
