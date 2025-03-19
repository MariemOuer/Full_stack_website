// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";


const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [customData, setCustomData] = useState({}); // Additional memory

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Set or update arbitrary variables
  const setVariable = (key, value) => {
    setCustomData((prev) => ({ ...prev, [key]: value }));
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCustomData({});
  };

  const value = {
    currentUser,
    customData,
    setVariable,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
