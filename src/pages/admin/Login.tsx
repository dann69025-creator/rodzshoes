import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;
      
      if (userEmail) {
        const docRef = doc(db, 'adminUsers', userEmail);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          toast.success('Bienvenido al panel');
          // AQUÍ ESTÁ LA CORRECCIÓN: Te enviará exactamente a /admin
          navigate('/admin'); 
        } else {
          await auth.signOut();
          toast.error('No tienes permisos de administrador');
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-900 p-3 rounded-full text-white mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Acceso Administrativo</h1>
          <p className="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
              placeholder="tu@correo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-medium py-3 px-4 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};