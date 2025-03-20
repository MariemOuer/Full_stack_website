import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [customData, setCustomData] = useState({}); // Additional memory

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.email?.toLowerCase() === "guest@gmail.com") {
        setIsGuest(true);
      } else {
        setIsGuest(false);
      }
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
    setIsGuest(false); // Reset guest mode on logout
  };

  const value = {
    currentUser,
    customData,
    setVariable,
    logout,
    isGuest,
    setIsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
