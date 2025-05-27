import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import SplashNavbar from '../components/SplashNavbar';
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // New state for success message
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    // Password must be at least 8 characters, include uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert email to lowercase immediately when user types
    if (name === "email") {
      setFormData({ ...formData, [name]: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear field-specific error when user starts typing again
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ""
      });
    }
    
    // Clear general error message
    if (error) {
      setError("");
    }
  };

  // Validate fields on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === "email" && value) {
      if (!validateEmail(value)) {
        setFieldErrors({
          ...fieldErrors,
          email: "Please enter a valid email address"
        });
      }
    }
    
    if (name === "password" && value) {
      if (!validatePassword(value)) {
        setFieldErrors({
          ...fieldErrors,
          password: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        });
      }
    }
    
    if (name === "confirmPassword" && value) {
      if (value !== formData.password) {
        setFieldErrors({
          ...fieldErrors,
          confirmPassword: "Passwords do not match"
        });
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = { ...fieldErrors };
    
    // Validate email
    if (!validateEmail(formData.email)) {
      newFieldErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Validate password
    if (!validatePassword(formData.password)) {
      newFieldErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      isValid = false;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false); // Reset success state
    
    // Ensure email is lowercase before submission (extra safeguard)
    const submissionData = {
      ...formData,
      email: formData.email.toLowerCase()
    };
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4000/auth/register", submissionData);
      
      if (response.data.success) {
        setSuccess(true); // Show success message
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { state: { successMessage: "Signup successful! Please login." } });
        }, 6000);
      } else {
        setError(response.data.error || "Signup failed.");
      }
    } catch (error) {
      // Handle specific error cases from backend
      if (error.response?.data?.field === "email" && error.response?.data?.code === "duplicate") {
        setFieldErrors({
          ...fieldErrors,
          email: "This email is already registered. Please use a different email or login."
        });
      } else if (error.response?.data?.field) {
        // Handle other field-specific errors
        setFieldErrors({
          ...fieldErrors,
          [error.response.data.field]: error.response.data.message
        });
      } else {
        // General error
        setError(error.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:4000/auth/google/signup", "_self");
  };

  return (
    <>
      <SplashNavbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join us today and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>

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
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
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
                    <i className="fas fa-eye"></i>
                  ) : (
                    <i className="fas fa-eye-slash"></i>
                  )}
                </button>
              </div>
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
                required
                className={fieldErrors.confirmPassword ? "input-error" : ""}
              />
              {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
            </div>

            <div className="form-group checkbox-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Signup successful! Redirecting to login...</div>}

            <button type="submit" className="auth-button" disabled={loading || success}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button className="google-auth-button" onClick={googleAuth}>
            <img src={require("../images/google.png")} alt="Google logo" /> 
            <span>Signup with Google</span> 
          </button>

          <div className="auth-footer">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;