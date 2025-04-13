import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import Navbar from "../components/Navbar";

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
  const navigate = useNavigate();

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

    // Validate email format before submission
    if (!validateEmail(formData.email)) {
      setFieldErrors({
        ...fieldErrors,
        email: "Please enter a valid email address",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4000/auth/login", {
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/home"); // Redirect to dashboard on success
      }
    } catch (error) {
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
      <Navbar />
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
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            {error && <div className="error-message">{error}</div>}

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