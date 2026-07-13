import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { generateWhatsAppLink } from '../services/whatsappService';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Checkout() {
  const { cart, calculateTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', telefono: '', ciudad: '', direccion: '', barrio: '', notas: ''
  });

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Tu carrito está vacío</h2>
        <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/catalog')}>Ir de compras</button>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const link = generateWhatsAppLink(formData, cart, calculateTotal());
    window.open(link, '_blank');
    clearCart();
    navigate('/thanks');
  };

  return (
    <main className="container" style={{ padding: '60px 20px' }}>
      <Helmet><title>Checkout | RODZSHOES</title></Helmet>
      <h1 style={{ marginBottom: '40px' }}>Finalizar Compra</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Datos de Envío</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input required type="text" name="nombre" placeholder="Nombre" className="input-field" onChange={handleChange} />
            <input required type="text" name="apellido" placeholder="Apellido" className="input-field" onChange={handleChange} />
          </div>
          <input required type="tel" name="telefono" placeholder="Teléfono" className="input-field" onChange={handleChange} />
          <input required type="text" name="ciudad" placeholder="Ciudad" className="input-field" onChange={handleChange} />
          <input required type="text" name="barrio" placeholder="Barrio" className="input-field" onChange={handleChange} />
          <input required type="text" name="direccion" placeholder="Dirección completa" className="input-field" onChange={handleChange} />
          <textarea name="notas" placeholder="Notas adicionales (opcional)" className="input-field" rows="3" onChange={handleChange}></textarea>

          <div style={{ background: '#222', padding: '20px', borderRadius: '8px', marginTop: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>Método de Pago</h3>
            <p style={{ color: '#25D366', fontWeight: 'bold' }}>Pago Contraentrega (Efectivo/Transferencia al recibir)</p>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '16px' }}>
            Confirmar Pedido vía WhatsApp
          </button>
        </form>

        <div style={{ background: 'var(--color-black-sec)', padding: '32px', borderRadius: '12px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Resumen del Pedido</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Talla: {item.size} | Cant: {item.quantity}</p>
                </div>
                <p>{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 'bold' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-red)' }}>{formatPrice(calculateTotal())}</span>
          </div>
        </div>
      </div>
    </main>
  );
}