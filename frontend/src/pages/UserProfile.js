import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import "../styles/UserProfile.css";
import axios from "axios";

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
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordTouched, setPasswordTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${userId}`);

        if (response.data) {
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

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    if (passwordSuccess || passwordError) {
      const timer = setTimeout(() => {
        setPasswordSuccess("");
        setPasswordError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess, passwordError]);

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
    setSuccess("");
    setError("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(`/api/users/${userId}`, {
        fullname: profile.fullname,
        email: profile.email
      });

      if (response.data && response.data.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);

        const updatedUser = { ...user, ...profile };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword && passwordTouched.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }
    if (!passwordData.newPassword && passwordTouched.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (passwordData.newPassword.length < 6 && passwordTouched.newPassword) {
      errors.newPassword = "Password must be at least 6 characters long.";
    }
    if (
      passwordData.newPassword !== passwordData.confirmPassword &&
      passwordTouched.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const passwordErrors = validatePassword();

  const handlePasswordBlur = (e) => {
    const { name } = e.target;
    setPasswordTouched({ ...passwordTouched, [name]: true });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(passwordErrors).length > 0) {
      setPasswordError("Please fix the errors before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/users/${userId}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordSuccess(response.data.message);
      setPasswordError("");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordTouched({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(err.response?.data?.message || "Failed to change password");
      setPasswordSuccess("");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="profile-container">
        <h1>Account Settings</h1>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {loading ? (
          <div className="profile-loading">Loading profile data...</div>
        ) : error ? (
          <div className="profile-error">{error}</div>
        ) : activeTab === "profile" ? (
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
                <div className="password-input">
                  <input
                    type={showPasswords.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                  >
                    {showPasswords.currentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <div className="field-error">{passwordErrors.currentPassword}</div>
                )}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-input">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <div className="field-error">{passwordErrors.newPassword}</div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <div className="field-error">{passwordErrors.confirmPassword}</div>
                )}
              </div>

              {/* <div className="password-requirements">
                <p>Password must:</p>
                <ul>
                  <li>Be at least 6 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                </ul>
              </div> */}

              <button type="submit" className="save-button">
                Change Password
              </button>
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