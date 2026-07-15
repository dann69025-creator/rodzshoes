import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 1. Lógica para Email y Contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.reload(); 
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  // 2. Lógica para Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.reload(); 
    } catch (err) {
      setError("Error al iniciar con Google: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Acceso Administrativo</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Botón de Google */}
      <button 
        onClick={handleGoogleLogin} 
        style={{ 
          marginBottom: '20px', padding: '10px', width: '100%', 
          backgroundColor: '#fff', border: '1px solid #ccc', cursor: 'pointer' 
        }}
      >
        Ingresar con Google
      </button>

      <p>o</p>

      {/* Formulario de Correo */}
      <form onSubmit={handleEmailLogin}>
        <input 
          type="email" placeholder="Correo" required 
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} 
        />
        <input 
          type="password" placeholder="Contraseña" required 
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} 
        />
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          Ingresar con Correo
        </button>
      </form>
    </div>
  );
}