import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedAdminRoute check:', { adminToken, isAdmin, path: location.pathname });
  }, [adminToken, isAdmin, location]);

  if (!adminToken || !isAdmin) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedAdminRoute;
