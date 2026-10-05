import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export const loginAdmin = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error cerrando sesión", error);
  }
};