import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'; // <--- Importa esto

const firebaseConfig = {
  apiKey: "AIzaSyA6JJJUyBFd3_8kG2E2MaWCKRwU80p7Hog",
  authDomain: "rodzshoes-a8f73.firebaseapp.com",
  projectId: "rodzshoes-a8f73",
  storageBucket: "rodzshoes-a8f73.firebasestorage.app",
  messagingSenderId: "670191862577",
  appId: "1:670191862577:web:a62d31c280108eb35f6610",
  measurementId: "G-1Z90XTB3P1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // <--- Exporta esto