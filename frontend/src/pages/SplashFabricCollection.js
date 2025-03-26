import React, { useState, useEffect } from "react";
import axios from "axios";
import SplashNavbar from '../components/SplashNavbar';
import Footer from '../components/Footer';
import "../styles/FabricCollection.css";

const SplashFabricCollection = () => {
    const [fabrics, setFabrics] = useState([]);

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

    return (
        <>
            <SplashNavbar />
            <div className="fabric-collection-page">
                <h2>Fabrics</h2>
                <div className="fabric-collection">
                    {fabrics.map(fabric => (
                        <div key={fabric._id} className="fabric-card">
                            <img src={fabric.image} alt={fabric.name} />
                            <h3>{fabric.name}</h3>
                            <p>{fabric.description}</p>
                            <p>${fabric.price}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SplashFabricCollection;
