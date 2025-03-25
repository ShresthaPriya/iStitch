import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AdminUsers.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ fullname: "", email: "", password: "" });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users');
                setUsers(response.data.users || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/users', newUser);
            setUsers([...users, response.data.user]);
            setNewUser({ fullname: "", email: "", password: "" });
        } catch (err) {
            console.error("Error adding user:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-content">
                <h2>Users</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <input type="text" name="fullname" value={newUser.fullname} onChange={handleChange} placeholder="Full Name" required />
                    <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" required />
                    <input type="password" name="password" value={newUser.password} onChange={handleChange} placeholder="Password" required />
                    <button type="submit">Add User</button>
                </form>
                <div className="admin-items">
                    {users.map(user => (
                        <div key={user._id} className="admin-item">
                            <h3>{user.fullname}</h3>
                            <p>{user.email}</p>
                            <button onClick={() => handleDelete(user._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
