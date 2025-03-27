import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { CartContext } from '../context/CartContext';
import "../styles/CategoryPage.css";

const MensPage = () => {
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToCart } = useContext(CartContext);

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

    return (
        <>
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <div className="category-page">
                <h2>Men's Clothing</h2>
                <div className="items-grid">
                    {items.map(item => (
                        <div key={item._id} className="item-card">
                            <img src={item.images[0]} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>${item.price}</p>
                            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            {/* <Footer /> */}
        </>
    );
};

export default MensPage;
