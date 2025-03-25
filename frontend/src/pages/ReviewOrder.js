import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import "../styles/ReviewOrder.css";

const ReviewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fabric, customization } = location.state;
    const { clearCart } = useContext(CartContext);

    const handlePlaceOrder = () => {
        alert("Order placed successfully!");
        clearCart();
        navigate('/home');
    };

    return (
        <>
            <Navbar />
            <div className="review-order-page">
                <h2>Review Your Order</h2>
                <div className="order-details">
                    <h3>Fabric</h3>
                    <div className="fabric-details">
                        <img src={fabric.image} alt={fabric.name} />
                        <div>
                            <h4>{fabric.name}</h4>
                            <p>{fabric.description}</p>
                        </div>
                    </div>
                    <h3>Customization</h3>
                    <div className="customization-details">
                        <p><strong>Style:</strong> {customization.style}</p>
                        <p><strong>Measurements:</strong> {customization.measurements}</p>
                        <p><strong>Additional Features:</strong> {customization.additionalFeatures}</p>
                    </div>
                    <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewOrder;
