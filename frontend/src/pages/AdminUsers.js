import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import "../styles/AdminUsers.css";
import axios from "axios";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(""); // Clear any previous errors
            
            console.log("Fetching users...");
            const response = await axios.get("http://localhost:4000/api/users");
            
            console.log("Users response:", response.data);
            setUsers(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(`Failed to fetch users: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                setError(""); // Clear any previous errors
                
                const response = await axios.delete(`http://localhost:4000/api/users/${userId}`);
                
                if (response.data.success) {
                    // Show success message
                    alert("User deleted successfully!");
                    
                    // Refresh the users list
                    fetchUsers();
                } else {
                    setError(response.data.message || "Failed to delete user");
                }
            } catch (err) {
                console.error("Error deleting user:", err);
                setError(`Failed to delete user: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-content">
                <h2>User Management</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="admin-panel">
                    <div className="admin-table">
                        <h3>User List</h3>
                        {loading ? (
                            <p className="loading-message">Loading users...</p>
                        ) : users.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.fullname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role || "user"}</td>
                                            <td>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-users-message">No users found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
