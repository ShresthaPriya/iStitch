import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css'; // Import custom CSS

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 'item-id-1',
      name: 'Non-Iron Stretch Light Blue Twill',
      price: 130,
      quantity: 1,
      image: require('../images/items/shirts/shirt4.jpg'),
    },
    // Add more items as needed
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current path:', window.location.pathname);
  }, []);

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const proceedToCheckout = () => {
    console.log('Navigating to checkout');
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">Rs.{item.price}</p>
              <div className="cart-item-quantity">
                <button onClick={() => decreaseQuantity(item.id)} className="quantity-button">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)} className="quantity-button">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3 className="cart-summary-title">Order Summary</h3>
        <p className="cart-summary-total">
          Total: Rs.{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </p>
        <button className="checkout-button" onClick={proceedToCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
