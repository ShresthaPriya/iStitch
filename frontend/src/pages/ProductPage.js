import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { Star } from "lucide-react";
import "../styles/ProductCard.css";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setProduct(response.data.item);
        // Set default selected size to the first available size
        if (response.data.item?.sizes?.length > 0) {
          const availableSizes = response.data.item.sizes.filter(s => s.available && s.inventory > 0);
          if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0].size);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setSizeError("");
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }

    // Add the product with the selected size to cart
    addToCart({
      ...product,
      selectedSize
    });
    
    // Show confirmation
    alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  const placeTailoringOrder = () => {
    // Navigate to customer measurements page
    navigate('/customer-measurements');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-loading">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="product-error">{error}</div>
        <Footer />
      </>
    );
  }

  // Get available sizes that have inventory
  const availableSizes = product?.sizes?.filter(s => s.available && s.inventory > 0) || [];

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="product-card-container">
        <div className="product-card-content">
          {/* Product Image */}
          <div className="product-image">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={`/images/${image}`}
                alt={product.name}
                className="image"
              />
            ))}
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

            {/* Size Selection */}
            <div className="size-selection">
              <h4 className="size-title">Sizes:</h4>
              <div className="size-buttons">
                {availableSizes.length > 0 ? (
                  availableSizes.map((sizeObj) => (
                    <button
                      key={sizeObj.size}
                      className={`size-button ${selectedSize === sizeObj.size ? "selected" : ""}`}
                      onClick={() => handleSizeChange(sizeObj.size)}
                    >
                      {sizeObj.size}
                      {sizeObj.inventory < 5 && <span className="inventory-low"> (Only {sizeObj.inventory} left)</span>}
                    </button>
                  ))
                ) : (
                  <p className="no-sizes">No sizes available</p>
                )}
              </div>
              {sizeError && <p className="size-error">{sizeError}</p>}
            </div>

            {/* Buttons */}
            <div className="action-buttons">
              <button 
                className="add-to-cart-button" 
                onClick={handleAddToCart}
                disabled={availableSizes.length === 0}
              >
                Add to cart
              </button>
              <button className="customize-button" onClick={placeTailoringOrder}>
                Customize
              </button>
            </div>
            
            {availableSizes.length === 0 && (
              <p className="out-of-stock-message">
                This product is currently out of stock. Please check back later or consider customizing it.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
