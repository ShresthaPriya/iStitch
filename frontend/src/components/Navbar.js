import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppContext } from "../App";

function Navbar() {
  const { username } = useContext(AppContext);
  const [menuActive, setMenuActive] = useState(false);
  const [shopDropdownActive, setShopDropdownActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/subcategories");
        setSubcategories(response.data.subcategories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const toggleShopDropdown = () => {
    setShopDropdownActive(!shopDropdownActive);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter((subcategory) => subcategory.category._id === categoryId);
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
        <li className="dropdown">
          <Link to="#" onClick={toggleShopDropdown}>Shop <i className="fa fa-chevron-down"></i></Link>
          {shopDropdownActive && (
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li className="dropdown" key={category._id}>
                  <Link to="#" onClick={() => handleCategoryClick(category._id)}>
                    {category.name} <i className="fa fa-chevron-right"></i>
                  </Link>
                  {activeCategory === category._id && (
                    <ul className="dropdown-menu sub-menu">
                      {getSubcategoriesForCategory(category._id).map((subcategory) => (
                        <li key={subcategory._id}>
                          <Link to={`/shop/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}>
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
        <li><Link to="/fabric">Fabric</Link></li>
        <li><Link to="/Measurements">Measurements</Link></li>
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
          <button className="profile-button">
            <Link to="/login">
              <i className="fa-solid fa-user"></i>
            </Link>
            {username && <span className="profile-badge">1</span>}
          </button>
          {username && (
            <div className="username-dropdown">
              <i className="fa fa-chevron-down dropdown-icon"></i>
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
