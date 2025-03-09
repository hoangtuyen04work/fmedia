import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const roles = user.roles || '[]';

  if (requiredRole && !roles.some((role) => role.roleName === requiredRole)) {
    // Redirect to a user-friendly page if role mismatch
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;