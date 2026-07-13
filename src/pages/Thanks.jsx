import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Thanks() {
  return (
    <main className="container fade-in" style={{ padding: '120px 20px', textAlign: 'center' }}>
      <Helmet><title>Gracias por tu compra | RODZSHOES</title></Helmet>
      <h1 style={{ fontSize: '48px', color: 'var(--color-red)', marginBottom: '24px' }}>¡GRACIAS!</h1>
      <p style={{ fontSize: '18px', color: 'var(--color-gray)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
        Hemos recibido tu pedido. Un asesor continuará con el proceso de confirmación y envío a través de WhatsApp.
      </p>
      <Link to="/catalog" className="btn-primary">Seguir Comprando</Link>
    </main>
  );
}