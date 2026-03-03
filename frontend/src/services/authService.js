const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    console.error('API Error Response:', data);
    throw new Error(data.message || data.error || 'Something went wrong');
  }
  
  return data;
};

// Register user
const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Logout user
const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true, message: 'Logged out successfully' };
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return !!(token && user);
};

// Get stored user data
const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get stored token
const getStoredToken = () => {
  return localStorage.getItem('token');
};

// Refresh user data
const refreshUserData = async () => {
  try {
    const data = await getCurrentUser();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data.user;
    }
    return null;
  } catch (error) {
    console.error('Refresh user data error:', error);
    return null;
  }
};

export {
  register,
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
  getStoredUser,
  getStoredToken,
  refreshUserData,
};
