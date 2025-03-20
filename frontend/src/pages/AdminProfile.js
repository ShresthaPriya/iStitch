import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminProfile.css";
import Sidebar from "../components/Sidebar";

const AdminProfile = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSave = () => {
        // Implement save functionality
        console.log("Profile saved");
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            console.log("Logged out");
            navigate('/login'); // Redirect to login page
        }
    };

    return (
        <div className="profile-container">
            <Sidebar />
            <div className="profile-content">
                <h2 className="title">Admin Profile</h2>
                <div className="profile-form">
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <label>Contact No</label>
                    <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
