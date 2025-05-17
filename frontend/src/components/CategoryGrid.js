import React from "react";
import { Link } from "react-router-dom";
import Navbar from './Navbar'; // If Navbar is a default export
import "../styles/Products.css";

const CategoryGrid = ({ includeNavbar = true }) => {
  const items = [
    { title: "Suits", image: require("../images/ProductCatPictures/suits.jpg"), id: "suits" },
    { title: "Kurta", image: require("../images/ProductCatPictures/kurta.jpg"), id: "kurta" },
    { title: "Blouse", image: require("../images/ProductCatPictures/blouse.jpg"), id: "blouse" },
  ];

  const heroBackground = require("../images/home.jpg"); // Use require for the hero background image

  return (
    <>
      {includeNavbar && <Navbar />} {/* Conditionally include the navbar */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-content">
          <h1>Get the custom-designed garments at your doorstep with iStitch</h1>
          <button className="explore-button" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
            Explore
          </button>
        </div>
      </div>
      <div className="products-container">
        <h2 className="products-title">What we have</h2>
        <div className="products-header">
          <a href="#viewAll" className="view-all-link">View all <span>▾</span></a>
        </div>
        <div className="products-grid">
          {items.map((item, index) => (
            <Link to={`/category/${item.id}`} key={index} className="product-card">
              <img src={item.image} alt={item.title} className="product-image" />
              <div className="product-title-container">
                <h3 className="product-title">{item.title}</h3>
                <div className="title-line"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryGrid;
