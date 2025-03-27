import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data.profile);
      } catch (err) {
        showMessage("Error fetching profile", "error");
      }
    };

    fetchProfile();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/api/user/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Profile updated successfully", "success");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="user-profile-container">
      <h1>Personal Details</h1>
      
      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            type="text"
            name="fullname"
            value={profile.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Enter your email"
            enabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="3"
          />
        </div>

        <button type="submit" className="save-button" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
    </>
  );
};

export default UserProfile;