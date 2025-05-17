import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Order from './pages/Order';
import AdminItems from './pages/AdminItems';
import AdminUsers from './pages/AdminUsers';

function ProtectedAdminRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken || !isAdmin) {
      navigate('/admin/login');
    }
  }, [adminToken, isAdmin, navigate]);

  if (!adminToken || !isAdmin) {
    return null;
  }

  return children;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <Order />
            </ProtectedAdminRoute>
          }
        />
        {/* Add protection to all admin routes */}
        <Route
          path="/admin/items"
          element={
            <ProtectedAdminRoute>
              <AdminItems />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminUsers />
            </ProtectedAdminRoute>
          }
        />
        {/* ...other admin routes... */}
      </Routes>
    </Router>
  );
}

export default AppRouter;