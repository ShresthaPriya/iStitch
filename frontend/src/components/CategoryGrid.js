import React from 'react';
import "../styles/Products.css";

const CategoryGrid = () => {
  const items = [
    { title: "Shirts", image: require('../images/ProductCatPictures/shirt.jpg') },
    { title: "Suits", image: require('../images/ProductCatPictures/suits.jpg'), description: "High quality custom-made suits.", button: "Learn More" },
    { title: "Pants", image: require('../images/ProductCatPictures/pants.jpg') },
    { title: "Kurta", image: require('../images/ProductCatPictures/kurta.jpg') },
    { title: "Blouse", image: require('../images/ProductCatPictures/blouse.jpg') },
  ];

  return (
    <div className="products-container">
      <h2 className="products-title">What we have</h2>
      <div className="products-grid">
        {items.map((item, index) => (
          <div key={index} className={`product-card ${item.title === "Suits" ? "large-card" : ""}`}>
            <img
              src={item.image}
              alt={item.title}
              className="product-image"
            />
            <div className="product-content">
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              {item.button && <button className="learn-more-btn">{item.button}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
