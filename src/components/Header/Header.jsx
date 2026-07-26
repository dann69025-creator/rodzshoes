import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { cartCount, setIsDrawerOpen } = useCart();
  const { isAdmin } = useAuth();

  // Estados para controlar la apertura del menú móvil y la barra de búsqueda
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        {/* Botón de menú con evento onClick e icono dinámico */}
        <button 
          className={styles.menuBtn} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <Link to="/" className={styles.logo}>
          RODZ<span>SHOES</span>
        </Link>

        {/* Menú de navegación con clase condicional para móviles */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link to="/catalog?brand=Nike" onClick={() => setIsMenuOpen(false)}>Nike</Link>
          <Link to="/catalog?brand=Adidas" onClick={() => setIsMenuOpen(false)}>Adidas</Link>
          <Link to="/rastreo" className="nav-link" onClick={() => setIsMenuOpen(false)}>Rastrear Pedido</Link>
          {isAdmin && (
            <Link to="/admin-orders" className={styles.adminLink} onClick={() => setIsMenuOpen(false)}>
              Acceso Administrativo
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {/* Botón de búsqueda con evento onClick */}
          <button 
            className={styles.iconBtn} 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>
          
          <button className={styles.cartBtn} onClick={() => setIsDrawerOpen(true)}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Barra de búsqueda desplegable opcional */}
      {isSearchOpen && (
        <div className={styles.searchBarContainer}>
          <input 
            type="text" 
            placeholder="Buscar zapatillas..." 
            className={styles.searchInput}
            autoFocus
          />
        </div>
      )}
    </header>
  );
}