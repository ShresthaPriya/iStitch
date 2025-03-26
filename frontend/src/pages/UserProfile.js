import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/UserProfile.css";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/profile');
        setProfile(response.data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/user/profile', profile);
      alert('Profile updated successfully');
    } catch (err) {
      console.error("Error updating profile:", err);
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-profile-page">
        <h2>User Profile</h2>
        <form onSubmit={handleSubmit} className="user-profile-form">
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={profile.fullname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
