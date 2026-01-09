import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SplashNavbar from '../components/SplashNavbar';
import Footer from '../components/Footer';
import "../styles/FabricCollection.css";

const SplashFabricCollection = () => {
    const [fabrics, setFabrics] = useState([]);
    const [sortedFabrics, setSortedFabrics] = useState([]);
    const [sortOrder, setSortOrder] = useState("default");
    const [showLoginMsgId, setShowLoginMsgId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFabrics = async () => {
            try {
                const response = await axios.get('/api/fabrics');
                setFabrics(response.data.fabrics || []);
                setSortedFabrics(response.data.fabrics || []);  // Initialize sorted fabrics
            } catch (err) {
                console.error("Error fetching fabrics:", err);
            }
        };

        fetchFabrics();
    }, []);

    useEffect(() => {
        let sortedData = [...fabrics];
        
        if (sortOrder === "low-to-high") {
            sortedData.sort((a, b) => a.price - b.price);  // Sort by price (low to high)
        } else if (sortOrder === "high-to-low") {
            sortedData.sort((a, b) => b.price - a.price);  // Sort by price (high to low)
        } else {
            sortedData = fabrics;  // Default order (no sort)
        }
        
        setSortedFabrics(sortedData);
    }, [sortOrder, fabrics]);  // Re-sort whenever sortOrder or fabrics changes

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleSelectForCustomization = (fabricId) => {
        setShowLoginMsgId(fabricId);
        setTimeout(() => {
            navigate("/login");
        }, 2000); // 2 seconds delay
    };

    return (
        <>
            <SplashNavbar />
            <div className="fabric-collection-page">
                <h2>Fabrics</h2>

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

                <div className="fabric-collection">
                    {sortedFabrics.map(fabric => (
                        <div key={fabric._id} className="fabric-card">
                            <img src={`/images/${fabric.images[0]}`} alt={fabric.name} />
                            <h3>{fabric.name}</h3>
                            <p>{fabric.description}</p>
                            <p>Rs. {fabric.price}</p>
                            <button
                                className="button"
                                onClick={() => handleSelectForCustomization(fabric._id)}
                            >
                                Select for Customization
                            </button>
                            {showLoginMsgId === fabric._id && (
                                <p className="login-msg">Please login to customize your order...</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SplashFabricCollection;
