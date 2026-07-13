import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { cart, isDrawerOpen, setIsDrawerOpen, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsDrawerOpen(false)} />
      <div className={`${styles.drawer} slide-in-right`}>
        <div className={styles.header}>
          <h2>Tu Carrito</h2>
          <button onClick={() => setIsDrawerOpen(false)}><X size={24} color="#fff" /></button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <p className={styles.empty}>El carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={`${item.id}-${item.size}`} className={styles.item}>
                <img src={item.images[0]} alt={item.name} />
                <div className={styles.details}>
                  <h3>{item.name}</h3>
                  <p>Talla: {item.size}</p>
                  <p className={styles.price}>{formatPrice(item.price)}</p>
                  <div className={styles.qty}>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className={styles.remove} onClick={() => removeFromCart(item.id, item.size)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Total:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}