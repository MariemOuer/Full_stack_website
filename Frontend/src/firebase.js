// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCp2YZ6QAYtkYAt3K_wQm7sDhARvUEXUDg',
  authDomain: 'occasio-1836c.firebaseapp.com',
  projectId: 'occasio-1836c',
  storageBucket: 'occasio-1836c.firebasestorage.app',
  messagingSenderId: '796666396948',
  appId: '1:796666396948:web:da2160dd0c32fec8810201',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
