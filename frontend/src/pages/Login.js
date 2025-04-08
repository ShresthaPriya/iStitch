import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import SplashNavbar from '../components/SplashNavbar'; // Import SplashNavbar
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import "../styles/Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4000/login", formData);
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        if (rememberMe) {
          localStorage.setItem("userEmail", formData.email);
        }
        navigate(location.state?.from || "/home");
      } else {
        setError(response.data.error || "Login failed.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:4000/auth/google/callback", "_self");
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Log in to your account to continue</p>
            {location.state?.successMessage && (
              <div className="success-message">{location.state.successMessage}</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="/resetpassword" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button className="google-auth-button" onClick={googleAuth}>
            <img src={require("../images/google.png")} alt="Google logo" />
            <span>Continue with Google</span>
          </button>

          <div className="auth-footer">
            Don't have an account? <a href="/auth/register">Sign up</a>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Login;