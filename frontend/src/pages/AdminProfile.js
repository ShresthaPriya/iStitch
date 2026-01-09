import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/admin/profile');
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
      await axios.put('/api/admin/profile', profile);
      alert('Profile updated successfully');
    } catch (err) {
      console.error("Error updating profile:", err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <h2>Admin Profile</h2>
        <form onSubmit={handleSubmit} className="admin-profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
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
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={profile.contactNumber}
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
    </div>
  );
};

export default AdminProfile;
