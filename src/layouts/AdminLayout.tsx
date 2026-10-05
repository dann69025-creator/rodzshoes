import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LayoutDashboard, ShoppingBag, Package, Image as ImageIcon, LogOut } from 'lucide-react';
import { logoutAdmin } from '@/services/authService';

export const AdminLayout = () => {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  
  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Pedidos', path: '/admin/pedidos', icon: <ShoppingBag size={20} /> },
    { name: 'Productos', path: '/admin/productos', icon: <Package size={20} /> },
    { name: 'Banners', path: '/admin/banners', icon: <ImageIcon size={20} /> },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-700">
          <span className="font-serif text-xl tracking-wider font-bold">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                  ? 'bg-accent text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-4 truncate px-2">{currentUser.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 md:hidden">
            <span className="font-serif text-xl font-bold text-primary">ADMIN</span>
            <button onClick={handleLogout} className="text-slate-500 hover:text-primary">
              <LogOut size={24} />
            </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};