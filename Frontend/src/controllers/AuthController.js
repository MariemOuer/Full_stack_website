// src/controllers/AuthController.js
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

export const useAuthController = () => {
  const signupWithEmail = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: user.email,
        uid: user.uid,
      });
      
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
