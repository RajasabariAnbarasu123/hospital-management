import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8080/api';
  
  // Add token to all requests if it exists
  axios.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle response errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      
      const { token, id, name, email: userEmail, role } = response.data;
      
      const userData = { id, name, email: userEmail, role };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);
      
      toast.success(`Welcome back, ${name}!`);
      return { success: true, role };
    } catch (error) {
      let message = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (error.response?.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || message;
      } else if (error.message) {
        message = error.message;
      }
      
      console.error('Login error:', error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      
      if (error.response?.status === 400) {
        message = error.response.data || 'Invalid registration data';
      } else if (error.response?.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || message;
      } else if (error.message) {
        message = error.message;
      }
      
      console.error('Register error:', error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    token,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};