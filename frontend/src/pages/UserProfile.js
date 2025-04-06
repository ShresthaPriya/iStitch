import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import "../styles/UserProfile.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullname: "",
    email: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "security"
  
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/users/${userId}`);
        
        if (response.data) {
          // Set profile data from response
          setProfile({
            fullname: response.data.fullname || "",
            email: response.data.email || ""
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Reset any messages when toggling edit mode
    setSuccess("");
    setError("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.put(`http://localhost:4000/api/users/${userId}`, {
        fullname: profile.fullname,
        email: profile.email
      });
      
      if (response.data && response.data.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        // Update the user data in localStorage
        const updatedUser = { ...user, ...profile };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    try {
      const response = await axios.put(`http://localhost:4000/api/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data && response.data.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="profile-container">
        <h1>Account Settings</h1>
        
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>
        
        {loading ? (
          <div className="profile-loading">Loading profile data...</div>
        ) : error ? (
          <div className="profile-error">{error}</div>
        ) : activeTab === 'profile' ? (
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <button 
                className={`edit-btn ${isEditing ? 'cancel' : ''}`} 
                onClick={toggleEdit}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={profile.fullname}
                    onChange={handleProfileChange}
                    required
                  />
                ) : (
                  <div className="profile-display-value">{profile.fullname}</div>
                )}
              </div>
              
              <div className="form-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                ) : (
                  <div className="profile-display-value">{profile.email}</div>
                )}
              </div>
              
              {isEditing && (
                <button type="submit" className="save-button">Save Changes</button>
              )}
            </form>
          </div>
        ) : (
          <div className="security-section">
            <h2>Change Password</h2>
            
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>
              
              <div className="password-requirements">
                <p>Password must:</p>
                <ul>
                  <li>Be at least 6 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                </ul>
              </div>
              
              <button type="submit" className="save-button">Change Password</button>
            </form>
          </div>
        )}
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </>
  );
};

export default UserProfile;