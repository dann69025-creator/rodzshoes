import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBol9uk_wCcr3HlI9hnpGm5VoJUZ1dW-jI",
  authDomain: "rodzshoes-3ff7a.firebaseapp.com",
  projectId: "rodzshoes-3ff7a",
  storageBucket: "rodzshoes-3ff7a.firebasestorage.app",
  messagingSenderId: "593801894212",
  appId: "1:593801894212:web:706c9c3d84c9af32489f11",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);