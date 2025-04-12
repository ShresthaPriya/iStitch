import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ZoomIn, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import SizeGuideTabs from "../components/SizeGuideTabs";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const location = useLocation();
  const { product } = location.state;
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    // Add product to cart logic here
    setIsCartOpen(true);
  };

  const toggleSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide);
  };

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="product-details-page">
        <div className="breadcrumb">
          <button className="back-button" onClick={() => window.history.back()}>
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>
        </div>

        <div className="product-details-container">
          {/* Product Images Section */}
          <div className="product-images">
            <div className="main-image-container">
              <img
                className="main-image"
                src={`http://localhost:4000/images/${mainImage}`}
                alt={product.name}
              />
              <button className="zoom-button">
                <ZoomIn size={20} />
              </button>
            </div>
            <div className="extra-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/images/${image}`}
                  alt={`Product view ${index + 1}`}
                  onClick={() => setMainImage(image)}
                  className={mainImage === image ? "active" : ""}
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info">
            <div className="product-header">
              <h2>{product.name}</h2>
              <div className="product-actions">
                <button className="share-btn">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="product-price">Rs. {product.price}</div>
            
            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="size-selection">
              <div className="selection-header">
                <label>Select Size:</label>
                <button className="size-chart-link" onClick={toggleSizeGuide}>
                  Size Guide
                </button>
              </div>
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

            {/* Call to Action */}
            <div className="product-actions-container">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
              <button className="buy-now-btn">
                Buy Now
              </button>
            </div>

            {/* Conditional Size Guide */}
            {showSizeGuide && (
              <div className="size-guide-wrapper">
                <h3>Detailed Size Guide</h3>
                <SizeGuideTabs />
              </div>
            )}
          </div>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetails;