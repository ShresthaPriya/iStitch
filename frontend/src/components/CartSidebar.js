import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={onClose}>X</button>
            <h2>Cart</h2>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item._id} className="cart-item">
                        <img src={item.images[0]} alt={item.name} />
                        <div>
                            <h3>{item.name}</h3>
                            <p>${item.price}</p>
                            <button onClick={() => removeFromCart(item._id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default CartSidebar;
