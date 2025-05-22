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
      console.log('Sending password reset request for:', email);
      
      // Send request to correct endpoint
      const response = await axios.post('http://localhost:4000/auth/forgetPassword', { 
        email: email.trim().toLowerCase()
      });
      
      console.log('Password reset response:', response.data);
      
      // Always show success message regardless of whether email exists
      setMessage('If your email is registered, you will receive instructions to reset your password.');
    } catch (err) {
      console.error('Password reset error:', err);
      
      // For network/server errors show a user-friendly message
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response && err.response.status === 500) {
        console.log('Error response:', err.response?.data);
        
        // Show a specific error message if the email service is not configured
        if (err.response.data && err.response.data.message && 
            err.response.data.message.includes('Missing credentials')) {
          setError('Our email service is currently unavailable. Please try again later or contact support.');
        } else {
          setError('An error occurred on the server. Please try again later.');
        }
      } else {
        // Still show success message to avoid exposing which emails are registered
        setMessage('If your email is registered, you will receive instructions to reset your password.');
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
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
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
                  <i className="fas fa-spinner fa-spin"></i> Sending...
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
