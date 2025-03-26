import React, { useState, useEffect } from "react";
import axios from "axios";
import SplashNavbar from '../components/SplashNavbar';
import Footer from '../components/Footer';
import "../styles/CategoryPage.css";

const SplashMensPage = () => {
    const [items, setItems] = useState([]);

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

    return (
        <>
            <SplashNavbar />
            <div className="category-page">
                <h2>Men's Clothing</h2>
                <div className="items-grid">
                    {items.map(item => (
                        <div key={item._id} className="item-card">
                            <img src={item.images[0]} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>${item.price}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SplashMensPage;
