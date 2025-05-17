import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  if (!isAdmin) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="admin-dashboard-summary">
          <div className="summary-card">
            <h3>Orders</h3>
            <p>Manage customer orders</p>
            <button onClick={() => navigate('/admin/orders')}>View Orders</button>
          </div>
          
          <div className="summary-card">
            <h3>Products</h3>
            <p>Manage product inventory</p>
            <button onClick={() => navigate('/admin/items')}>View Products</button>
          </div>
          
          <div className="summary-card">
            <h3>Users</h3>
            <p>Manage user accounts</p>
            <button onClick={() => navigate('/admin/users')}>View Users</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
