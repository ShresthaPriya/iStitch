import React, { useState } from "react";
import axios from "axios";
import "../styles/ForgetPassword.css";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequest = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4000/auth/forgetPassword", {
        email,
      });

      setLoading(false);
      if (response.data.success) {
        setMessage("A password reset link has been sent to your email.");
        setError("");
      } else {
        setError(response.data.error || "Failed to send reset link.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
    setError(""); // Clear error message
    return true;
  };

  return (
    <div className="Auth-page">
      <div className="Auth-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleRequest}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
