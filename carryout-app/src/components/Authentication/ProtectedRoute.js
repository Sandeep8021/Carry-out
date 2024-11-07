// src/components/Authentication/ProtectedRoute.js
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path as necessary

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Assuming you have an authentication context

  /*
  return (
    
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to="/login" />}
    />
    
  );
  */
  return isAuthenticated?<Outlet/>:<Navigate to="/"/>
};

export default ProtectedRoute;
