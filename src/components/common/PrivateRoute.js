import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = useAuth(token);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;