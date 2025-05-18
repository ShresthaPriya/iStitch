import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import SplashNavbar from "../components/SplashNavbar";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as necessary

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Proper way to use auth context

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "email" ? value.toLowerCase() : value }); // Convert email to lowercase

    // Clear errors when typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
    if (error) setError("");
  };

  // Validate fields on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email" && value && !validateEmail(value)) {
      setFieldErrors({
        ...fieldErrors,
        email: "Please enter a valid email address",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(false);

    // Validate email format before submission
    if (!validateEmail(formData.email)) {
        setFieldErrors({
            ...fieldErrors,
            email: "Please enter a valid email address",
        });
        return;
    }

    // Always normalize email to lowercase to ensure consistency
    const normalizedEmail = formData.email.toLowerCase().trim();
    console.log('Submitting login with email:', normalizedEmail);

    try {
        setLoading(true);
        
        // Try multiple endpoints with the normalized email
        let response;
        try {
            console.log('Trying first endpoint with:', { email: normalizedEmail, password: '•••••••' });
            response = await axios.post("http://localhost:4000/auth/login", {
                email: normalizedEmail,
                password: formData.password,
            });
        } catch (firstError) {
            console.log('First login endpoint failed, trying alternative:', firstError.message);
            
            // Try alternative endpoint
            console.log('Trying second endpoint with:', { email: normalizedEmail, password: '•••••••' });
            response = await axios.post("http://localhost:4000/api/auth/login", {
                email: normalizedEmail,
                password: formData.password,
            });
        }

      if (response.data.success) {
        // Store the token and user info
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("role", response.data.user.role);
          
          // Transfer guest cart to user cart if guest cart exists
          const guestCart = localStorage.getItem('cart_guest');
          const userId = response.data.user._id || response.data.user.id;
          
          if (guestCart && !localStorage.getItem(`cart_${userId}`)) {
            localStorage.setItem(`cart_${userId}`, guestCart);
          }
          
          // Dispatch auth change event
          window.dispatchEvent(new Event('auth-change'));
        } else {
          console.warn("User details are missing in the response.");
        }

        setLoginSuccess(true); // Show login success message
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific backend errors
      if (error.response?.data?.error === "User not found") {
        setFieldErrors({
          ...fieldErrors,
          email: "This email is not registered. Please sign up first.",
        });
      } else if (error.response?.data?.error === "Invalid password") {
        setFieldErrors({
          ...fieldErrors,
          password: "Incorrect password. Please try again.",
        });
      } else {
        setError(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:4000/auth/google/login", "_self");
  };

  return (
    <>
      < SplashNavbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Log in to continue your journey</p>
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
                onBlur={handleBlur}
                placeholder=""
                required
                className={fieldErrors.email ? "input-error" : ""}
              />
              {fieldErrors.email && (
                <div className="field-error">{fieldErrors.email}</div>
              )}
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
                onBlur={handleBlur}
                placeholder=""
                required
                className={fieldErrors.password ? "input-error" : ""}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye"></i>  // "Click to hide"
                ) : (
                  <i className="fas fa-eye-slash"></i>  // "Click to show"
                )}
              </button>
            </div>
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

            <div className="form-group forgot-password">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loginSuccess && <div className="success-message">Login successful! Redirecting...</div>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Logging In...
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
            <span>Login with Google</span>
          </button>

          <div className="auth-footer">
            Don't have an account? <a href="/auth/register">Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;