import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { CartContext } from '../context/CartContext';
import "../styles/FabricCollection.css";

const FabricCollection = () => {
    const [fabrics, setFabrics] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false); // State to control CartSidebar visibility
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchFabrics = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/fabrics');
                setFabrics(response.data.fabrics || []);
            } catch (err) {
                console.error("Error fetching fabrics:", err);
            }
        };

        fetchFabrics();
    }, []);

    const handleAddToCart = (fabric) => {
        addToCart(fabric); // Add fabric to the cart
        setIsCartOpen(true); // Open the CartSidebar
    };

    return (
        <>
            <Navbar onCartClick={() => setIsCartOpen(true)} /> {/* Pass onCartClick to open CartSidebar */}
            <div className="fabric-collection-page">
                <h2>Select Fabric</h2>
                <div className="fabrics-grid">
                    {fabrics.map(fabric => (
                        <div key={fabric._id} className="fabric-card">
                            <img src={`http://localhost:4000/images/${fabric.images[0]}`} alt={fabric.name} />
                            <h3>{fabric.name}</h3>
                            <p>{fabric.description}</p>
                            <button className="select-btn" onClick={() => handleAddToCart(fabric)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> {/* CartSidebar integration */}
            <Footer />
        </>
    );
};

export default FabricCollection;
