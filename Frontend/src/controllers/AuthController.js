// src/controllers/AuthController.js
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";


export const useAuthController = () => {
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

  return {
    signupWithEmail,
    loginWithEmail
  };
};
