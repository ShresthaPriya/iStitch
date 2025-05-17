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
      
      // Try both possible endpoints
      let response;
      try {
        // First try with /auth prefix
        response = await axios.post('http://localhost:4000/auth/forgot-password', { email });
      } catch (err) {
        console.log('First endpoint failed, trying alternative endpoint');
        // Try alternative endpoint if first one fails
        response = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      }
      
      console.log('Password reset response:', response.data);
      
      // Always show success message regardless of whether email exists
      setMessage('If your email is registered, you will receive instructions to reset your password.');
    } catch (err) {
      console.error('Password reset error:', err);
      // For network/server errors only, don't expose if email exists
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        console.log('Error response:', err.response?.data);
        // Still show success message even on server errors
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
