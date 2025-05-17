import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context without a default value
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser); // Safely parse user if it exists
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        localStorage.removeItem("user"); // Remove invalid user data
        return null; // Return null if parsing fails
      }
    }
    return null; // Return null if no user is stored
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (err) {
          console.error("Error parsing user data:", err);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      let response;
      try {
        // Try the first endpoint
        response = await axios.post("http://localhost:4000/auth/login", { email, password });
      } catch (firstError) {
        // If first endpoint fails, try alternative
        response = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      }

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('auth-change'));
  };

  // Value to be provided to consumers
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
