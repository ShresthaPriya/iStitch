import React, { useState, useEffect } from 'react';
import '../styles/Checkout.css'; // Import custom CSS
// import codLogo from '../images/payment/cod.png';
import Navbar from './Navbar';

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

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

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    console.log('Checkout component mounted');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    console.log('Selected payment method:', paymentMethod);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
  };

  const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = 50; // Example delivery fee
  const grandTotal = total + deliveryFee;

  return (
    <>
      <Navbar />
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zip">Zip Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="visa"
                  checked={paymentMethod === 'visa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src={visaLogo} alt="Visa" className="payment-logo" />
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          <button type="submit" className="checkout-button">Place Order</button>
        </form>
        <div className="cart-summary">
          <h3 className="cart-summary-title">Order Summary</h3>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">Rs.{item.price}</p>
                  <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="cart-summary-total">Subtotal: Rs.{total}</p>
          <p className="cart-summary-delivery">Delivery Fee: Rs.{deliveryFee}</p>
          <p className="cart-summary-grand-total">Total: Rs.{grandTotal}</p>
        </div>
      </div>
      {showSuccessMessage && (
        <div className="success-message">
          Order placed successfully!
        </div>
      )}
    </div></>
  );
};

export default Checkout;
