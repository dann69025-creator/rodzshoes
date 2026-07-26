import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

// 1. IMPORTA TUS ARCHIVOS AQUÍ
import logo from '../assets/logo.png'; 
import heroBg from '../assets/banner.png';

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <main>
      <Helmet>
        <title>RODZSHOES | Zapatillas Deportivas 1:1</title>
      </Helmet>

      {/* Hero */}
      <section style={{
        height: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        // Efecto viñeta con degradado hacia blanco (#F8F8F8) en los 4 bordes
        backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 35%, #F8F8F8 95%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center', 
        padding: '20px'
      }}>
        <div className="fade-in">
          {/* 3. TU LOGO PERSONALIZADO */}
          <img src={logo} alt="RodzShoes Logo" style={{ maxWidth: '250px', marginBottom: '20px' }} />
          
          <h1 style={{ fontSize: '48px', marginBottom: '16px', textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 2px 4px rgb(255, 255, 255)' }}>Eleva tu Estilo</h1>
          <p style={{ fontSize: '18px', color: '#E5E7EB', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px', textShadow: '0 1px 2px rgba(252, 252, 252, 1)' }}>
            Descubre las zapatillas más exclusivas de las mejores marcas del mundo. Calidad garantizada.
          </p>
          <Link to="/catalog" className="btn-primary">Explorar Colección</Link>
        </div>
      </section>

      <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '40px', color: '#111111' }}>Marcas Destacadas</h2>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.7 }}>
          {['Nike', 'Adidas', 'Puma', 'New Balance', 'ASICS'].map(brand => (
            <h3 key={brand} style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '2px', color: '#111111' }}>{brand}</h3>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#111111' }}>Los Más Buscados</h2>
          <Link to="/catalog" style={{ color: '#E10600' }}>Ver Todos →</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {featured.map(product => (
            <Link to={`/product/${product.slug}`} key={product.id} style={{
              background: '#FFFFFF', borderRadius: 'var(--radius)', overflow: 'hidden',
              transition: 'transform 0.3s', display: 'block', textDecoration: 'none', color: 'inherit',
              border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
              
              <div style={{ position: 'relative', height: '250px', background: '#F8F8F8' }}>
                <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ padding: '16px' }}>
                <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}>{product.brand}</p>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#111111' }}>{product.name}</h3>
                <p style={{ color: '#E10600', fontWeight: 'bold' }}>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}