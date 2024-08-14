import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const UserRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.isAdmin) {
    return <Navigate to="/login" />;
  }
  if(user.isAdmin){
    return <Navigate to="/addProduct" />;

  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export { UserRoute, AdminRoute };
