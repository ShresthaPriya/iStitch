import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const location = useLocation();
  const { product } = location.state; // Get product data from navigation state
  const [mainImage, setMainImage] = useState(product.images[0]); // Set the first image as the main image
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size

  // Get the last image as the size chart
  const sizeChartImage = product.images[product.images.length - 1];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    // Add product to cart logic here
    setIsCartOpen(true);
  };

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="product-details-container">
        <div className="product-images">
          <img className="main-image" src={`http://localhost:4000/images/${mainImage}`} alt={product.name} />
          <div className="extra-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:4000/images/${image}`}
                alt={index === product.images.length - 1 ? "Size Chart" : `Extra ${index}`}
                onClick={() => setMainImage(image)}
                className={mainImage === image ? "active" : ""}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> Rs. {product.price}</p>

          {/* Size Chart Section */}
          {sizeChartImage && (
            <div className="size-chart-section">
              <p>Size chart:</p>
              <img
                src={`http://localhost:4000/images/${sizeChartImage}`} // Display size chart image
                alt="Size Chart"
                className="size-chart-image"
                width="300"
              />
            </div>
          )}

          {/* Size Selection */}
          <div className="size-selection">
            <label htmlFor="size">Select Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              required
            >
              <option value="">Select a size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetails;
