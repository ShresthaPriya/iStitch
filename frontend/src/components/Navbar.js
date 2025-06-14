import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppContext } from "../context/AppContext";
import { CartContext } from "../context/CartContext";
import { debounce } from "lodash";

function Navbar({ onCartClick }) {
  const appContext = useContext(AppContext);
  const { username, setUsername } = appContext || { username: null, setUsername: () => {} };

  const cartContext = useContext(CartContext);
  const { cart } = cartContext || { cart: [] };

  const [menuActive, setMenuActive] = useState(false);
  const [profileDropdownActive, setProfileDropdownActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownActive(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchBarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuActive(!menuActive);
  const toggleProfileDropdown = () => setProfileDropdownActive(!profileDropdownActive);
  const handleLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUsername(null);
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleSearch = debounce(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/search?query=${searchQuery}`);
      const { fabrics, items } = response.data.results;
      const combinedResults = [
        ...fabrics.map(item => ({ ...item, type: "fabric" })),
        ...items.map(item => ({ ...item, type: "item" }))
      ];
      setSearchResults(combinedResults);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  }, 300);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      const firstResult = searchResults[0];
      if (firstResult.type === "fabric") {
        navigate(`/fabric-details/${firstResult._id}`);
      } else {
        navigate(`/product-details`, { state: { product: firstResult } });
      }
      setSearchResults([]);
      setSearchBarVisible(false);
    }
  };

  return (
    <nav className="navbar">
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

      <div className="logo">
        <h1><Link to="/home" className="logo-link">iStitch</Link></h1>
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
        <div className="search-icon-only">
          <button
            className="search-toggle-button"
            onClick={() => setSearchBarVisible((prev) => !prev)}
          >
            <i className="fa fa-search"></i>
          </button>
        </div>

        {searchBarVisible && (
          <div className="search-bar" ref={searchRef}>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <div key={result._id} className="search-result-item">
                <h4
                  className="search-result-name"
                  onClick={() => {
                    if (result.type === "fabric") {
                      navigate(`/fabric-details/${result._id}`);
                    } else {
                      navigate(`/item-details/${result._id}`);
                    }
                    setSearchResults([]);
                    setSearchBarVisible(false);
                  }}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {result.name} <span style={{ fontStyle: "italic", fontSize: "0.8rem" }}>({result.type})</span>
                </h4>
                <p>Price: Rs. {result.price}</p>
              </div>
            ))}
          </div>
        )}

        <div className="cart-section">
          <button className="cart-button" onClick={onCartClick}>
            <i className="fa fa-shopping-cart"></i>
            <span className="cart-badge">{cart.length}</span>
          </button>
        </div>

        <div className="profile-section" ref={profileRef}>
          <button className="profile-button" onClick={toggleProfileDropdown}>
            <i className="fa-solid fa-user"></i>
            {username && <span className="profile-badge"></span>}
          </button>
          {profileDropdownActive && (
            <div className="username-dropdown">
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

export default Navbar;
