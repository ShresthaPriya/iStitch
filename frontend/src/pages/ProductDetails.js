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

  const handleAddToCart = () => {
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
                alt={`Extra ${index}`}
                onClick={() => setMainImage(image)}
                className={mainImage === image ? "active" : ""}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetails;
