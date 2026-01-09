import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppContext } from "../context/AppContext"; // Updated to use the new AppContext
import { CartContext } from '../context/CartContext';
import { debounce } from "lodash";

function SplashNavbar({ onCartClick }) {
  const { username } = useContext(AppContext);
  const { cart } = useContext(CartContext);
  const [menuActive, setMenuActive] = useState(false);
  const [profileDropdownActive, setProfileDropdownActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const searchRef = useRef(null);
    const profileRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error(err);
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

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownActive(!profileDropdownActive);
  };

  

  const handleProfileClick = () => {
    navigate("/login");
  };

  const handleSearch = debounce(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
  
      try {
        const response = await axios.get(`/api/search?query=${searchQuery}`);
        setSearchResults(response.data.results.fabrics || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    }, 300);
  
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && searchResults.length > 0) {
        navigate(`/fabric-details/${searchResults[0]._id}`);
        setSearchResults([]);
        setSearchBarVisible(false);
      }
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
                  className="fabric-name"
                  onClick={() => navigate(`/fabric-details/${result._id}`)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {result.name}
                </h4>
                <p>Price: Rs.{result.price}</p>
              </div>
            ))}
          </div>
        )}


        <div className="profile-section">
          <button className="profile-button" onClick={handleProfileClick}>
            <i className="fa-solid fa-user"></i>
            {username && <span className="profile-badge"></span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default SplashNavbar;
