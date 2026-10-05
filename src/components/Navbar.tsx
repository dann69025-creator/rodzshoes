import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Función para leer cuántos pares hay en el carrito
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('rodz_cart') || '[]');
    const count = cart.reduce((total: number, item: any) => total + item.cantidad, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount(); // Carga inicial
    // Escucha cada vez que agregamos algo al carrito desde ProductDetail
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => 
    `uppercase tracking-wider text-sm font-bold transition-colors ${
      isActive ? 'text-red-600' : 'text-slate-900 hover:text-red-600'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white border-b-2 border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-black tracking-tighter uppercase text-slate-900 flex items-center gap-1">
              RODZ<span className="text-red-600">SHOES</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkStyle}>Inicio</NavLink>
            <NavLink to="/catalogo" className={navLinkStyle}>Catálogo</NavLink>
            <NavLink to="/rastreo" className={navLinkStyle}>Rastrear Pedido</NavLink>
            <NavLink to="/contacto" className={navLinkStyle}>Contacto</NavLink>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/carrito" className="relative text-slate-900 hover:text-red-600 transition-colors p-2">
              <ShoppingCart size={24} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-fade-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 hover:text-red-600 p-2">
                {isMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-inner">
            <Link to="/" onClick={closeMenu} className="block px-3 py-4 text-white font-bold uppercase tracking-wider text-sm hover:text-red-500 border-b border-slate-800">Inicio</Link>
            <Link to="/catalogo" onClick={closeMenu} className="block px-3 py-4 text-white font-bold uppercase tracking-wider text-sm hover:text-red-500 border-b border-slate-800">Catálogo</Link>
            <Link to="/rastreo" onClick={closeMenu} className="block px-3 py-4 text-white font-bold uppercase tracking-wider text-sm hover:text-red-500 border-b border-slate-800">Rastrear Pedido</Link>
            <Link to="/contacto" onClick={closeMenu} className="block px-3 py-4 text-white font-bold uppercase tracking-wider text-sm hover:text-red-500">Contacto</Link>
          </div>
        </div>
      )}
    </nav>
  );
};