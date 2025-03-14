// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [customData, setCustomData] = useState({}); 
  const [isGuest, setIsGuest] = useState(localStorage.getItem("isGuest") === "true"); 

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.removeItem("isGuest"); 
        setIsGuest(false);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCustomData(userDoc.data());
        }
      } else {
        setCustomData({});
      }
    });
    return unsubscribe;
  }, [db]);

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