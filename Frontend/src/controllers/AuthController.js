import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export const useAuthController = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || "No Email",
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email
  const signupWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Login with email
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // 🔥 Fix: Guest Login uses a preset email/password
  const loginAsGuest = async () => {
    try {
      const guestEmail = "guest@gmail.com";
      const guestPassword = "123456";
      const userCredential = await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
      setCurrentUser({
        uid: userCredential.user.uid,
        email: guestEmail,
      });
      return userCredential;
    } catch (error) {
      console.error("Error logging in as guest:", error);
      throw error;
    }
  };

  return {
    currentUser,
    signupWithEmail,
    loginWithEmail,
    loginAsGuest,
  };
};
