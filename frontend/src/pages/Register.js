import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
import axios from "axios";
// import { GoogleLogin } from "@react-oauth/google";
import { AppContext } from "../App";

const Signup = () => {
  const { fullname, setFullname } = useContext(AppContext);
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
  
    console.log("Submitting data:", { fullname, email, password });  // Log data for debugging

    try {
      setLoading(true);
  
      const response = await axios.post("http://localhost:4000/register", {
        fullname,
        email,
        password,
        confirmPassword,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      setLoading(false);
  
      const data = response.data;
      if (data.success) {
        setFullname(fullname); // Set the fullname in the context
        alert("Signup successful!");
        navigate("/Login");
      } else {
        setError(data.error|| "Signup failed."  );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during Signup:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "An unexpected error occurred.");  // Log error response for debugging
      }
      setError("An error occurred. Please try again.");
    }
  };

  

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

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
            {error && <div className="error-message">{error}</div>} {/* Error display */}

            <button type="submit">Sign Up</button>
          </form>
          <div className="Auth-footer">
            <p>
              Already have an account? <Link to="/Login">Log in</Link>
            </p>
            <span>or</span>
          </div>
          {/* Uncomment this if using Google OAuth */}
          {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
        </div>
        <div className="Auth-image">
          {/* <h1>iStitch</h1> */}
          <img src={require("../images/iStitch.png")} alt="Signup Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
