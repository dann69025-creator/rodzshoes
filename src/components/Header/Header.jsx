import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Importación correcta
import styles from './Header.module.css';

export default function Header() {
  const { cartCount, setIsDrawerOpen } = useCart();
  const { isAdmin } = useAuth(); // Usamos el contexto para saber si es admin

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <button className={styles.menuBtn}><Menu size={24} /></button>
        
        <Link to="/" className={styles.logo}>
          RODZ<span>SHOES</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/">Inicio</Link>
          <Link to="/catalog">Catálogo</Link>
          <Link to="/catalog?brand=Nike">Nike</Link>
          <Link to="/catalog?brand=Adidas">Adidas</Link>
          <Link to="/rastreo" className="nav-link">Rastrear Pedido</Link>
          {isAdmin && (
            <Link to="/admin-orders" className={styles.adminLink}>
              Acceso Administrativo
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <button className={styles.iconBtn}><Search size={20} /></button>
          <button className={styles.cartBtn} onClick={() => setIsDrawerOpen(true)}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}