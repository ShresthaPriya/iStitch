import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/CustomizeDress.css";

const CustomizeDress = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fabric } = location.state;
    const [customization, setCustomization] = useState({
        itemToBeMade: "",
        style: "",
        additionalStyling: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomization({ ...customization, [name]: value });
    };

    const handleProceedToOrder = () => {
        navigate('/review-order', { state: { fabric, customization } });
    };

    return (
        <>
            <Navbar />
            <div className="customize-dress-page">
                <h2>Customize Your Dress</h2>
                <div className="selected-fabric">
                    <h3>Selected Fabric</h3>
                    <img src={fabric.image} alt={fabric.name} />
                    <p>{fabric.name}</p>
                    <p>{fabric.description}</p>
                </div>
                <div className="customization-form">
                    <div className="form-group">
                        <label>Item to be made</label>
                        <select name="itemToBeMade" value={customization.itemToBeMade} onChange={handleChange} required>
                            <option value="">Select an item</option>
                            <option value="Shirt Half">Shirt Half</option>
                            <option value="Shirt Full">Shirt Full</option>
                            <option value="Pant">Pant</option>
                            <option value="Suit 2 Piece">Suit 2 Piece</option>
                            <option value="Suit 3 Piece">Suit 3 Piece</option>
                            <option value="Blazer">Blazer</option>
                            <option value="Long Coat">Long Coat</option>
                            <option value="Half Coat">Half Coat</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Style</label>
                        <select name="style" value={customization.style} onChange={handleChange} required>
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
                        <input type="text" name="additionalStyling" value={customization.additionalStyling} onChange={handleChange} placeholder="Enter additional styling" />
                    </div>
                    <button className="proceed-btn" onClick={handleProceedToOrder}>Proceed to Order</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CustomizeDress;
