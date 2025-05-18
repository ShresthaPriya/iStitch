import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin'); // Redirect to /admin instead of /admin/dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      console.log('Attempting admin login with:', { email });
      // Check both possible API endpoints
      let response;
      try {
        response = await axios.post('http://localhost:4000/api/auth/admin-login', {
          email,
          password
        });
      } catch (firstError) {
        console.log('First endpoint failed, trying alternative endpoint');
        // Try alternative endpoint if first one fails
        response = await axios.post('http://localhost:4000/auth/admin-login', {
          email,
          password
        });
      }

      if (response.data.success) {
        console.log('Admin login successful');
        setSuccess(true); // Show success message
        // Store admin token and info
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('isAdmin', 'true');
        // Navigate to /admin after a short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Provide more detailed error message
      if (err.response?.status === 404) {
        setError('Admin login endpoint not found. Please check server configuration.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p>Enter your credentials to access the admin dashboard</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Login successful! Redirecting...</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="back-to-site">
          <a href="/">Back to main site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
