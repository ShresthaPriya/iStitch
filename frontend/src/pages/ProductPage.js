import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Star } from "lucide-react";
import "../styles/ProductCard.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedFabric, setSelectedFabric] = useState("Cotton");
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const fabrics = ["Cotton", "Silk", "Linen"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/items/${id}`);
        setProduct(response.data.item);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    // Add item to cart logic here
  };

  const placeTailoringOrder = () => {
    // Place tailoring order logic here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="product-card-container">
        <div className="product-card-content">
          {/* Product Image */}
          <div className="product-image">
            <img
              src={`http://localhost:4000/uploads/${product.images[0]}`}
              alt={product.name}
              className="image"
            />
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h2 className="product-title">{product.name}</h2>
            <div className="product-rating">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
              <Star size={18} />
              <span className="rating-text">4.5</span>
            </div>
            <p className="product-price">Rs.{product.price}</p>
            <p className="product-description">{product.description}</p>

            {/* Fabric Selection */}
            <div className="fabric-selection">
              <h4 className="fabric-title">Fabric:</h4>
              <div className="fabric-buttons">
                {fabrics.map((fabric) => (
                  <button
                    key={fabric}
                    className={`fabric-button ${selectedFabric === fabric ? "selected" : ""}`}
                    onClick={() => setSelectedFabric(fabric)}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

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
              <button className="customize-button" onClick={placeTailoringOrder}>Customize</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
