import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import "../styles/AdminUsers.css";
import axios from "axios";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newUser, setNewUser] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "user"
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(""); // Clear any previous errors
            
            const response = await axios.post("http://localhost:4000/api/users", newUser);
            
            if (response.data.success) {
                // Reset the form
                setNewUser({
                    fullname: "",
                    email: "",
                    password: "",
                    role: "user"
                });
                
                // Show success message
                alert("User added successfully!");
                
                // Refresh the users list
                fetchUsers();
            } else {
                setError(response.data.message || "Failed to add user");
            }
        } catch (err) {
            console.error("Error adding user:", err);
            setError(`Failed to add user: ${err.response?.data?.message || err.message}`);
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
                    <div className="admin-form-container">
                        <h3>Add New User</h3>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label htmlFor="fullname">Full Name</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={newUser.fullname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit">Add User</button>
                        </form>
                    </div>

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
