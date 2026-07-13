import React from 'react';
export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #222', padding: '60px 0 20px', marginTop: '60px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '24px', letterSpacing: '-1px', marginBottom: '16px' }}>RODZ<span style={{ color: 'var(--color-red)' }}>SHOES</span></h2>
          <p style={{ color: 'var(--color-gray)', fontSize: '14px', lineHeight: '1.6' }}>Tienda independiente multimarca de zapatillas originales. Tu estilo al siguiente nivel.</p>
        </div>
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Enlaces Rápidos</h3>
          <ul style={{ listStyle: 'none', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li>Inicio</li>
            <li>Catálogo</li>
            <li>Rastrea tu pedido</li>
            <li>Guía de tallas</li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Políticas</h3>
          <ul style={{ listStyle: 'none', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li>Términos y Condiciones</li>
            <li>Política de Envíos</li>
            <li>Devoluciones y Garantías</li>
            <li>Privacidad</li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Contacto</h3>
          <ul style={{ listStyle: 'none', color: 'var(--color-gray)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li>WhatsApp: +57 322 8819495</li>
            <li>Lunes a Sábado: 9am - 5pm</li>
            <li>Domingos: 11am - 3pm</li>
            <li>Colombia</li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ textAlign: 'center', borderTop: '1px solid #222', paddingTop: '20px', color: '#666', fontSize: '12px' }}>
        &copy; {new Date().getFullYear()} RODZSHOES. Proyecto Ecommerce Independiente. Todos los derechos reservados.
      </div>
    </footer>
  );
}