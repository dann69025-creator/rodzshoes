import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const OrderStatus = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const docRef = doc(db, 'ordenes', orderId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrderData(docSnap.data());
      } else {
        setError('No encontramos ningún pedido con este ID. Verifica e intenta de nuevo.');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Hubo un error al buscar tu pedido. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-status-container">
      <div className="status-header">
        <h2>Rastrea tu Pedido</h2>
        <p>Ingresa el ID de tu compra para conocer el estado actual.</p>
      </div>

      <form onSubmit={handleSearch} className="status-form">
        <input
          type="text"
          placeholder="Ej: ABC123XYZ..."
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="status-input"
        />
        <button type="submit" disabled={loading} className="status-btn">
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="status-error-msg">{error}</div>}

      {orderData && (
        <div className="status-result-card">
          <h3>Estado actual:</h3>
          <span className={`status-badge ${orderData.status ? orderData.status.toLowerCase() : 'pendiente'}`}>
            {orderData.status || 'Pendiente'}
          </span>
          
          {/* AQUÍ ESTÁ LA CORRECCIÓN: Leemos items, name, size y quantity */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="order-summary-box">
              <h4>Resumen del pedido:</h4>
              <ul className="order-items-list">
                {orderData.items.map((item, index) => (
                  <li key={index} className="order-item-row">
                    <div className="item-main-info">
                      {/* Mostramos la marca y el nombre juntos */}
                      <span className="item-model-name">{item.brand} {item.name}</span>
                      {/* Mostramos la talla */}
                      {item.size && <span className="item-model-size">Talla: {item.size}</span>}
                    </div>
                    {/* Mostramos la cantidad */}
                    <span className="item-model-qty">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="status-thanks">
            {/* Leemos el nombre del cliente desde el mapa "cliente" que vimos en tu base de datos */}
            ¡Gracias por confiar en nosotros, {orderData.cliente?.apellido ? orderData.cliente.apellido.split(' ')[0] : 'bro'}!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;