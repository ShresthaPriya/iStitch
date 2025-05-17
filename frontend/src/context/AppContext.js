import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(" ");
  
  useEffect(() => {
    // Initialize username from localStorage if available
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        if (userData && userData.fullname) {
          setUsername(userData.fullname);
          setFullname(userData.fullname);
        }
      }
    } catch (error) {
      console.error("Error loading username from localStorage:", error);
    }
  }, []);

  return (
    <AppContext.Provider value={{ username, setUsername, fullname, setFullname }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
