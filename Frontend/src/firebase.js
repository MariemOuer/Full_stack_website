// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWdqbQw9TCVBobLfw0ZjCE5upXATHT2lc",
  authDomain: "occasio-9ce85.firebaseapp.com",
  projectId: "occasio-9ce85",
  storageBucket: "occasio-9ce85.firebasestorage.app",
  messagingSenderId: "259414550691",
  appId: "1:259414550691:web:535736c4a02e9150673716",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
