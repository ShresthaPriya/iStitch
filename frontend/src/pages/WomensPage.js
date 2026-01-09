import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { CartContext } from '../context/CartContext'; // Import CartContext
import "../styles/CategoryPage.css";
import { useNavigate } from "react-router-dom";

const WomensPage = () => {
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToCart } = useContext(CartContext);
    const [sortOrder, setSortOrder] = useState("default");
    
    const navigate = useNavigate(); // Use navigate for redirection

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('/api/items/category/67d84a23e603c05e661caecd');
                setItems(response.data.items || []); // Ensure items is always an array
            } catch (err) {
                console.error("Error fetching items:", err);
                setItems([]); // Set items to an empty array on error
            }
        };

        fetchItems();
    }, []);

    const handleAddToCart = (item) => {
        addToCart(item);
        setIsCartOpen(true);
    };

    const handleViewDetails = (item) => {
        navigate(`/product-details`, { state: { product: item } }); // Navigate to ProductDetails page
    };

      const sortedItem = [...items].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    } else if (sortOrder === "high-to-low") {
      return b.price - a.price;
    } else {
      return 0;
    }
  });
const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

    return (
        <>
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <div className="category-page">
                <h2>Women's Clothing</h2>
                <div className="sort-container">
            <div className="sort-label">Sort by:</div>
            <select 
                    className="sort-dropdown"
                    value={sortOrder}
                    onChange={handleSortChange}
                >
                    <option value="default">Default</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                </select>
                </div>
                <div className="items-grid">
                    {sortedItem .map(item => (
                        <div key={item._id} className="item-card">
                            <img 
                                src={item.images?.[0] ? `/images/${item.images[0]}` : '/path/to/fallback-image.jpg'} 
                                alt={item.name} 
                                onClick={() => handleViewDetails(item)} // Redirect on image click
                            />
                            <h3>{item.name}</h3>
                            {/* <p>{item.description}</p> */}
                            <p>Rs.{item.price}</p>
                            <button onClick={() => handleViewDetails(item)}>View Product</button>
                        </div>
                    ))}
                </div>
            </div>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            {/* <Footer /> */}
        </>
    );
};

export default WomensPage;
