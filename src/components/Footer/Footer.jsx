import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-col">
          <h3 className="footer-logo">RODZ<span>SHOES</span></h3>
          <p className="footer-desc">
            Eleva tu estilo con las zapatillas más exclusivas del mundo. Calidad garantizada.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/catalogo">Catálogo</a></li>
            <li><a href="/rastrear-pedido">Rastrear Pedido</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p>WhatsApp: +57 322 381 9495</p>
          <p>Instagram: @rodzshoes</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 RODZSHOES. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}