import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || '').toLowerCase();
  const lowerAllowedRoles = (allowedRoles || []).map(r => r.toLowerCase());

  if (allowedRoles && !lowerAllowedRoles.includes(userRole)) {
    // If user's role is not authorized for this route, redirect to their role's dashboard
    if (userRole === 'ceo') return <Navigate to="/ceo" replace />;
    if (userRole === 'hr') return <Navigate to="/hr" replace />;
    return <Navigate to="/employee" replace />;
  }

  return children;
};

export default ProtectedRoute;
