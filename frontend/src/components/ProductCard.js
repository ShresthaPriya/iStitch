import { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css'; // Import custom CSS

const ProductCard = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const navigate = useNavigate();

  const addToCart = () => {
    // Add item to cart logic here
    navigate('/cart');
  };

  return (
    <div className="product-card-container">
      <div className="product-card-content">
        {/* Product Image */}
        <div className="product-image">
          <img
            src={require('../images/items/shirts/shirt4.jpg')}
            alt="Non-Iron Stretch Light Blue Twill"
            className="image"
          />
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h2 className="product-title">Non-Iron Stretch Light Blue Twill</h2>
          <div className="product-rating">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <Star size={18} />
            <span className="rating-text">4.5</span>
          </div>
          <p className="product-price">Rs.130</p>
          <p className="product-description">
            Our non-iron stretch fabrics are made from a premium blend of 100s
            two-ply American Supima cotton and a small percentage of performance
            spandex. They have just the right amount of stretch to move with you
            comfortably during day-to-day wear.
          </p>

          {/* Size Selection */}
          <div className="size-selection">
            <h4 className="size-title">Sizes:</h4>
            <div className="size-buttons">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart-button" onClick={addToCart}>Add to cart</button>
            <button className="customize-button">Customize</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
