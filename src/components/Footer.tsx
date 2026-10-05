import { Link } from 'react-router-dom';
import { STORE_CONFIG } from '../config/store';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-1">
              RODZ<span className="text-red-600">SHOES</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 font-medium">
              {STORE_CONFIG.description || 'Los sneakers más exclusivos y codiciados del mercado directo a tus pies.'}
            </p>
            <div className="flex space-x-4 mt-6">
              <a href={STORE_CONFIG.instagram} target="_blank" rel="noreferrer" className="bg-slate-800 p-2.5 rounded-sm hover:bg-red-600 text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 border-l-2 border-red-600 pl-2">Enlaces Rápidos</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/catalogo" className="hover:text-red-500 transition-colors">Catálogo Completo</Link></li>
              <li><Link to="/rastreo" className="hover:text-red-500 transition-colors">Rastrea tu pedido</Link></li>
              <li><Link to="/contacto" className="hover:text-red-500 transition-colors">Contacto & Soporte</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 border-l-2 border-red-600 pl-2">Categorías</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/catalogo?genero=Men" className="hover:text-red-500 transition-colors">Men (Hombre)</Link></li>
              <li><Link to="/catalogo?genero=Women" className="hover:text-red-500 transition-colors">Women (Mujer)</Link></li>
              <li><Link to="/catalogo?genero=Kids" className="hover:text-red-500 transition-colors">Kids (Niños)</Link></li>
              <li><Link to="/catalogo?genero=Unisex" className="hover:text-red-500 transition-colors">Unisex</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 border-l-2 border-red-600 pl-2">Contacto</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-red-500 flex-shrink-0" />
                <span>+57 {STORE_CONFIG.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-red-500 flex-shrink-0" />
                <span>{STORE_CONFIG.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} RODZSHOES. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="cursor-pointer hover:text-white transition-colors">Términos de servicio</span>
            <span className="cursor-pointer hover:text-white transition-colors">Política de privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};