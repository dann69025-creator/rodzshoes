import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Login from '../pages/Login';

export default function AdminAuth({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Empezamos a cargar
      // ... dentro de onAuthStateChanged
        if (user) {
          console.log("Usuario actual:", user.email);
          const adminRef = doc(db, "admins", user.email);
          const adminSnap = await getDoc(adminRef);

          console.log("¿Existe en Firestore?", adminSnap.exists());

          if (adminSnap.exists()) {
            setAuthorized(true);
          } else {
            console.log("No se encontró el correo en la colección admins");
            setAuthorized(false);
          }
        }
// ...
      try {
        if (user) {
          const adminRef = doc(db, "admins", user.email);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            setAuthorized(true);
          } else {
            console.log("Usuario no es admin");
            setAuthorized(false);
          }
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error al verificar permisos:", error);
        setAuthorized(false); // Si hay error, no dejamos pasar
      } finally {
        setLoading(false); // ESTO ES LA CLAVE: Siempre apaga el cargador
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Cargando seguridad...</div>;
  if (!authorized) return <Login />;

  return children;
}