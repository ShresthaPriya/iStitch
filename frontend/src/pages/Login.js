import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Basic email and password validation
  const validateForm = () => {
    if (!email || !password) {
      setError("All fields must be filled.");
      return false;
    }

    // Email validation (basic format check)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    // Password validation (minimum length check)
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setError(""); // Clear error message
    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) return; // Only proceed if form is valid

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      setLoading(false);
      const data = response.data;

      if (data.success) {
        alert("Login successful!");
        // Store user data in localStorage or Context API (if needed)
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home"); // Redirect to the home page or dashboard
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const loginWithGoogle = () => {
    window.open("http://localhost:8080/auth/google/callback", "_self");
  };

  return (
    <div className="Auth-page">
      <div className="Auth-container">
        <div className="Auth-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="Auth-footer">
            <p>
              Don't have an account? <a href="/register">Sign Up</a>
            </p>
          </div>
          <button className="login-with-google-btn" onClick={loginWithGoogle}>
            Sign In With Google
          </button>
        </div>
        <div className="Auth-image">
          <img src={require("../images/iStitch.png")} alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;