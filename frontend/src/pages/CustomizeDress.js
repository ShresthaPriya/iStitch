import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from "axios";
import { FaTshirt, FaRuler, FaArrowLeft, FaArrowRight, FaTag, FaInfoCircle } from 'react-icons/fa';
import "../styles/CustomizeDress.css";

const CustomizeDress = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fabric } = location.state || {};
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    const [customization, setCustomization] = useState({
        itemToBeMade: {},
        style: "",
        additionalStyling: ""
    });
    const [priceEstimate, setPriceEstimate] = useState(0);
    const [userMeasurements, setUserMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);

    const itemPricingFactors = {
        "Shirt Half": 1.2,
        "Shirt Full": 1.5,
        "Pant": 1.8,
        "Suit 2 Piece": 3.0,
        "Suit 3 Piece": 4.0,
        "Blazer": 2.5,
        "Long Coat": 2.8,
        "Half Coat": 2.0
    };

    useEffect(() => {
        const fetchUserMeasurements = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/user-measurements/${userId}`);
                if (response.data.success) {
                    setUserMeasurements(response.data.measurements);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user measurements:", err);
                setUserMeasurements([]);
                setLoading(false);
            }
        };
        fetchUserMeasurements();
    }, [userId]);

    useEffect(() => {
        if (fabric && Object.values(customization.itemToBeMade).length > 0) {
            const fabricPrice = fabric.price || 0;
            const itemFactor = 1;
            let estimatedPrice = fabricPrice * itemFactor;
            estimatedPrice = Math.round(estimatedPrice);
            setPriceEstimate(estimatedPrice);
        } else {
            setPriceEstimate(0);
        }
    }, [fabric, customization.itemToBeMade, itemPricingFactors]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        setCustomization((prev) => ({
            ...prev,
            itemToBeMade: {
                ...prev.itemToBeMade,
                [index]: value
            }
        }));
    };

    const handleProceedToOrder = () => {
        if (!fabric) {
            alert("Please select a fabric first");
            return;
        }
        if (Object.values(customization.itemToBeMade).length === 0) {
            alert("Please select items to be made");
            return;
        }
        if (!userMeasurements || userMeasurements.length === 0) {
            alert("Please save your measurements before placing a custom order");
            navigate('/customer-measurements');
            return;
        }
        navigate('/review-order', {
            state: {
                fabric,
                customization,
                priceEstimate,
                userMeasurements
            }
        });
    };

    if (!fabric) {
        return (
            <>
                <Navbar />
                <div className="customize-dress-page">
                    <h2>No Fabric Selected</h2>
                    <p className="no-fabric-message">Please select a fabric first to customize your dress.</p>
                    <button
                        className="back-button"
                        onClick={() => navigate('/fabric-collection')}
                    >
                        <FaArrowLeft className="button-icon" /> Browse Fabrics
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    // Ensure products is parsed properly
    const productList = Array.isArray(fabric.products) 
    ? fabric.products 
    : typeof fabric.products === 'string' 
        ? JSON.parse(fabric.products) 
        : [];
    return (
        <>
            <Navbar />
            <div className="customize-dress-page">
                <h2>Customize Your Dress</h2>
                <div className="selected-fabric">
                    <h3><span className="step-number">1</span> Selected Fabric</h3>
                    <div className="fabric-details">
                        <div className="fabric-image-container">
                            <img
                                src={`http://localhost:4000/images/${fabric.images[0]}`}
                                alt={fabric.name}
                                className="fabric-image"
                            />
                        </div>
                        <div className="fabric-info">
                            <h4>{fabric.name}</h4>
                            <p className="fabric-description">{fabric.description}</p>
                            <p className="fabric-price"><FaTag className="icon" /> Price: Rs. {fabric.price}/meter</p>
                        </div>
                    </div>
                </div>

                <div className="customization-form">
                    <h3><span className="step-number">2</span> Customization Options</h3>
                    {productList.map((product, index) => (
                        <div className="form-group" key={index}>
                            <label><FaTshirt className="form-icon" /> Item to be made ({product})</label>
                            <select
                                name={`itemToBeMade-${index}`}
                                value={customization.itemToBeMade[index] || ""}
                                onChange={(e) => handleChange(e, index)}
                                required
                            >
                                <option value="">Select an option</option>
                                <option value={product}>{product}</option>
                            </select>
                        </div>
                    ))}

                    <div className="form-group">
                        <label><FaRuler className="form-icon" /> Style</label>
                        <select
                            name="style"
                            value={customization.style}
                            onChange={(e) => setCustomization({ ...customization, style: e.target.value })}
                            required
                        >
                            <option value="">Select a style</option>
                            <option value="Tight Fitting">Tight Fitting</option>
                            <option value="Slim Fit">Slim Fit</option>
                            <option value="Normal Fitting">Normal Fitting</option>
                            <option value="Loose Fit">Loose Fit</option>
                            <option value="Baggy">Baggy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Additional Styling</label>
                        <textarea
                            name="additionalStyling"
                            value={customization.additionalStyling}
                            onChange={(e) => setCustomization({ ...customization, additionalStyling: e.target.value })}
                            placeholder="Enter additional styling requirements or special requests"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="price-estimate">
                        <h3>Estimated Price: Rs. {priceEstimate}</h3>
                        <p className="price-note">
                            <FaInfoCircle className="info-icon" /> Final price may vary slightly based on detailed measurements and specific design elements.
                        </p>
                    </div>

                    <button
                        className="proceed-btn"
                        onClick={handleProceedToOrder}
                        disabled={Object.values(customization.itemToBeMade).length === 0 || !customization.style}
                    >
                        Proceed to Review Order <FaArrowRight className="button-icon" />
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CustomizeDress;
