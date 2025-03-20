import React from "react";
import { Link } from "react-router-dom";
import "../styles/Products.css";
import Navbar from './Navbar';

const CategoryGrid = () => {
  const items = [
    { title: "Suits", image: require("../images/ProductCatPictures/suits.jpg"), id: "suits" },
    { title: "Kurta", image: require("../images/ProductCatPictures/kurta.jpg"), id: "kurta" },
    { title: "Blouse", image: require("../images/ProductCatPictures/blouse.jpg"), id: "blouse" },
  ];

  return (
    <>  
      <Navbar />
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
