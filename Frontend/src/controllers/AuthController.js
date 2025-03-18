// src/controllers/AuthController.js
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { apiService } from "../services/ApiService";

export const useAuthController = () => {
  // Sign up with email
  const signupWithEmail = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const firebaseUser = userCredential.user;

      await apiService.post("/api/user/sign-up", { authId: firebaseUser.uid, email: firebaseUser.email, phoneNumber: userData.phone, name: userData.firstName + " " + userData.lastName });

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
    loginWithEmail,
  };
};
