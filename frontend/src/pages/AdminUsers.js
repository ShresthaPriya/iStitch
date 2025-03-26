import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AdminUsers.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users');
                console.log("Fetched users from API:", response.data); // Log entire response
                setUsers(response.data); // Set the users data
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    // Function to format the date in a user-friendly way
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-content">
                <h2>Users</h2>
                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.fullname}</td>
                                        <td>{user.email}</td>
                                        <td>{formatDate(user.createdAt)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
