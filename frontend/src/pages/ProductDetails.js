import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import SizeGuideTabs from "../components/SizeGuideTabs"; // Import the tabs component
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const location = useLocation();
  const { product } = location.state;
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

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
          <img
            className="main-image"
            src={`http://localhost:4000/images/${mainImage}`}
            alt={product.name}
          />
          <div className="extra-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:4000/images/${image}`}
                alt={
                  index === product.images.length - 1
                    ? "Size Chart"
                    : `Extra ${index}`
                }
                onClick={() => setMainImage(image)}
                className={mainImage === image ? "active" : ""}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>
            <strong>Price:</strong> Rs. {product.price}
          </p>

         

           {/* Size Selection */}
           <div className="size-selection">
            <label>Select Size:</label>
            <div className="size-options">
              {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {/* Size Guide Tabs Section */}
          <div className="size-guide-wrapper">
            <h3>Detailed Size Guide</h3>
            <SizeGuideTabs />
          </div>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetails;
