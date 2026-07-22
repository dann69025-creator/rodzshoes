import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Firebase imports
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Checkout() {
  const { cart, calculateTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', telefono: '', departamento: '', ciudad: '', direccion: '', barrio: '', notas: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Tu carrito está vacío</h2>
        <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/catalog')}>Ir de compras</button>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Función interna para formatear el teléfono
  const obtenerTelefonoFormateado = (tel) => {
    return tel.startsWith('+57') ? tel : `+57${tel}`;
  };

  const enviarAlertaTelegram = async (idPedido, telFormateado) => {
    const botToken = import.meta.env.VITE_TELEGRAM_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Faltan credenciales de Telegram. Saltando envío.");
      return;
    }

    const listaProductos = cart.map(item => `▪️ ${item.quantity}x ${item.name} (Talla ${item.size})`).join('\n');
    
    const mensaje = `🛒 *NUEVO PEDIDO: ${idPedido}*
👤 *Cliente:* ${formData.nombre} ${formData.apellido}
📞 *Teléfono:* ${telFormateado}
📍 *Ubicación:* ${formData.departamento}, ${formData.ciudad}
🏠 *Dirección:* ${formData.direccion}
📝 *Notas:* ${formData.notas || 'Ninguna'}
💰 *Total:* ${formatPrice(calculateTotal())}
📦 *Productos:*
${listaProductos}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: mensaje, parse_mode: 'Markdown' }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const telefonoFinal = obtenerTelefonoFormateado(formData.telefono);

    try {
      // 1. Guardar en Firebase (con el teléfono formateado)
      const nuevaOrden = {
        cliente: { ...formData, telefono: telefonoFinal },
        items: cart,
        total: calculateTotal(),
        estado: 'pendiente',
        fecha: serverTimestamp(),
        metodoPago: 'Contraentrega'
      };

      const docRef = await addDoc(collection(db, 'ordenes'), nuevaOrden);
      
      // 2. Enviar a Telegram (usando el teléfono formateado)
      await enviarAlertaTelegram(docRef.id, telefonoFinal);
      
      // 3. NUEVO: Redirección automática a WhatsApp
      // AQUÍ DEBES PONER EL NÚMERO DE TU TIENDA (con el código de país, sin el +, ej: 573001234567)
      const numeroTienda = "573000000000"; 
      
      // Armamos el mensaje reemplazando el carácter extraño por un emoji 🙏
      const textoWhatsapp = `Hola RODZSHOES, acabo de hacer el pedido con ID: ${docRef.id}. Por favor confírmame el despacho de mi orden por este medio. ¡Muchas gracias! 🙏`;
      const urlWhatsapp = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(textoWhatsapp)}`;
      
      // Abrimos WhatsApp en una pestaña nueva
      window.open(urlWhatsapp, '_blank');
      
      // 4. Finalizar
      clearCart();
      navigate('/thanks');

    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un error al procesar el pedido. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
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
          <input required type="tel" name="telefono" placeholder="+57 300 000 0000" className="input-field" onChange={handleChange} />
          <input required type="text" name="departamento" placeholder="Departamento" className="input-field" onChange={handleChange} />
          <input required type="text" name="ciudad" placeholder="Ciudad" className="input-field" onChange={handleChange} />
          <input required type="text" name="direccion" placeholder="Dirección completa" className="input-field" onChange={handleChange} />
          <textarea name="notas" placeholder="Notas adicionales (opcional)" className="input-field" rows="3" onChange={handleChange}></textarea>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '24px', padding: '16px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
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