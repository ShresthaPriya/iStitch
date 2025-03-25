import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/FabricCollection.css";
import { useNavigate } from "react-router-dom";

const FabricCollection = () => {
    const [fabrics, setFabrics] = useState([]);
    const [selectedFabric, setSelectedFabric] = useState(null);
    const navigate = useNavigate();

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

    const handleSelectFabric = (fabric) => {
        setSelectedFabric(fabric);
    };

    const handleProceedToCustomization = () => {
        if (selectedFabric) {
            navigate('/customize-dress', { state: { fabric: selectedFabric } });
        } else {
            alert("Please select a fabric first.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="fabric-collection-page">
                <h2>Select Fabric</h2>
                <div className="fabrics-grid">
                    {fabrics.map(fabric => (
                        <div key={fabric._id} className={`fabric-card ${selectedFabric && selectedFabric._id === fabric._id ? 'selected' : ''}`}>
                            <img src={fabric.image} alt={fabric.name} />
                            <h3>{fabric.name}</h3>
                            <p>{fabric.description}</p>
                            <button className="select-btn" onClick={() => handleSelectFabric(fabric)}>Select for Customization</button>
                        </div>
                    ))}
                </div>
                <button className="proceed-btn" onClick={handleProceedToCustomization}>Proceed to Customization</button>
            </div>
            <Footer />
        </>
    );
};

export default FabricCollection;
