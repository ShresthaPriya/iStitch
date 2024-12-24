import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import axios from "axios";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/register", {
        fullname,
        email,
        password,
        confirmPassword,
      });

      setLoading(false);

      const data = response.data;
      if (data.success) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during Signup:", error);
      setError("An error occurred. Please try again.");
    }
  };

  // Google Authentication
  const googleAuth = () => {
    window.open("http://localhost:4000/auth/google/callback", "_self");
  };

  return (
    <div className="Auth-page">
      <div className="Auth-container">
        <div className="Auth-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
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
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            <div className="policy-checkbox">
              <label>
                <input type="checkbox" required />
                I agree with all the terms and conditions.
              </label>
            </div>
            {error && <div className="error-message">{error}</div>}

            <button type="submit">Sign Up</button>
          </form>
          <div className="Auth-footer">
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
          <button className="google_btn" onClick={googleAuth}>
            <img src={require("../images/google.png")} alt="google icon" />
            <span>Sign Up with Google</span>
          </button>
        </div>
        <div className="Auth-image">
          <img src={require("../images/iStitch.png")} alt="Signup Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
