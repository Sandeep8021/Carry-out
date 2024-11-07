import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  const login = (token,email) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem('authToken', token); // Store token in localStorage
    
    localStorage.setItem('userEmail', email )
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken('');
    localStorage.removeItem('authToken'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
