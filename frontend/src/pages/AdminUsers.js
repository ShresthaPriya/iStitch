import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import "../styles/AdminUsers.css";
import axios from "axios";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editUserModalOpen, setEditUserModalOpen] = useState(false);

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

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditUserModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:4000/api/users/${editingUser._id}`,
                {
                    fullname: editingUser.fullname,
                    email: editingUser.email,
                    role: editingUser.role
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.success) {
                // Update user in the list
                setUsers(users.map(user => 
                    user._id === editingUser._id ? response.data.user : user
                ));
                setEditUserModalOpen(false);
                alert('User updated successfully');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user: ' + (error.response?.data?.message || error.message));
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
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Operations</th> {/* Changed from "Actions" to "Operations" */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.fullname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role || "user"}</td>
                                            <td className="operations">
                                                <button className="edit-btn" title="Edit" onClick={() => handleEditUser(user)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="delete-btn" title="Delete" onClick={() => handleDelete(user._id)}>
                                                    <i className="fas fa-trash"></i>
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

            {editUserModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit User</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div className="form-group">
                                <label htmlFor="fullname">Full Name</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    value={editingUser.fullname}
                                    onChange={(e) => setEditingUser({...editingUser, fullname: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button type="button" className="cancel-btn" onClick={() => setEditUserModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
