import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, calculateTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = calculateTotal();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={onClose}>X</button>
            <h2>Cart</h2>
            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button className="continue-shopping" onClick={() => navigate('/home')}>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={`${item._id}-${item.selectedSize}-${index}`} className="cart-item">
                                <img 
                                    src={`/images/${item.images[0]}`} 
                                    alt={item.name} 
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-size">Size: {item.selectedSize}</p>

                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.selectedSize,
                                                    Math.max(1, (item.quantity || 1) - 1)
                                                )
                                            }
                                            className="qty-btn"
                                        >
                                            -
                                        </button>
                                        <span className="qty-value">{item.quantity || 1}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.selectedSize,
                                                    (item.quantity || 1) + 1
                                                )
                                            }
                                            className="qty-btn"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="cart-item-price">
                                        Rs. {item.price} × {item.quantity || 1} = Rs. {(item.price * (item.quantity || 1)).toFixed(2)}
                                    </p>

                                    <button 
                                        onClick={() => removeFromCart(item._id, item.selectedSize)}
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartSidebar;
