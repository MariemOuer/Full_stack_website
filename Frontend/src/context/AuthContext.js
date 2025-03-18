// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext(null);
const baseURL = process.env.NODE_ENV === undefined ? process.env.REACT_APP_PRODUCTION_BACKEND_URL : process.env.REACT_APP_DEVELOPMENT_BACKEND_URL || "http://localhost:5000";

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [customData, setCustomData] = useState({});
  const [isGuest, setIsGuest] = useState(localStorage.getItem("isGuest") === "true");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.removeItem("isGuest");
        setIsGuest(false);

        try {
          const token = await user.getIdToken();

          const response = await fetch(baseURL + "/api/user/authenticate", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          setCustomData(data);
        } catch (error) {
          console.error("Error fetching custom data:", error);
          setCustomData({});
        }
      } else {
        setCustomData({});
      }
    });

    return unsubscribe;
  }, []);

  const setGuestMode = (value) => {
    setIsGuest(value);
    localStorage.setItem("isGuest", value);
  };

  const setVariable = (key, value) => {
    setCustomData((prev) => ({ ...prev, [key]: value }));
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCustomData({});
    setIsGuest(false);
    localStorage.removeItem("isGuest");
  };

  const value = {
    currentUser,
    customData,
    isGuest,
    setIsGuest: setGuestMode,
    setVariable,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
