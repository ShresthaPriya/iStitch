import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/Auth.css";
import SplashNavbar from "../components/SplashNavbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      console.log('Requesting password reset for:', email);
      
      const response = await axios.post('/auth/forgetPassword', { 
        email: email.trim().toLowerCase() 
      });
      
      console.log('Password reset response:', response.data);
      
      if (response.data.success) {
        setMessage(response.data.message || 'A new password has been sent to your email. Please check your inbox and change it after logging in.');
      } else {
        setError(response.data.message || 'Failed to process your request. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      
      // For network/server errors only
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An error occurred while processing your request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SplashNavbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Reset Your Password</h2>
            <p>Enter your email address and we'll send you a new password.</p>
          </div>
          
          {message && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i> {message}
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;