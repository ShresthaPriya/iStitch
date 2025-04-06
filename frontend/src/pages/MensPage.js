import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { CartContext } from '../context/CartContext';
import "../styles/CategoryPage.css";
import { useNavigate } from "react-router-dom";

const MensPage = () => {
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate(); // Use navigate for redirection

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/items/category/67da68cc5bdd84464f2494c4`);
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

    return (
        <>
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <div className="category-page">
                <h2>Men's Clothing</h2>
                <div className="items-grid">
                    {items.map(item => (
                        <div key={item._id} className="item-card">
                            <img 
                                src={item.images?.[0] ? `http://localhost:4000/images/${item.images[0]}` : '/path/to/fallback-image.jpg'} 
                                alt={item.name} 
                                onClick={() => handleViewDetails(item)} // Redirect on image click
                            />
                            <h3>{item.name}</h3>
                            {/* <p>{item.description}</p> */}
                            <p>${item.price}</p>
                            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default MensPage;
