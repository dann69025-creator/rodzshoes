import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

// 1. IMPORTA TUS ARCHIVOS AQUÍ
import logo from '../assets/logo.png'; 
import heroBg from '../assets/banner.jpg';

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
        flexDirection: 'column', // Añadido para apilar logo y texto
        alignItems: 'center', 
        justifyContent: 'center',
        // 2. USAMOS TUS VARIABLES DE IMAGEN AQUÍ
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center', 
        padding: '20px'
      }}>
        <div className="fade-in">
          {/* 3. TU LOGO PERSONALIZADO */}
          <img src={logo} alt="RodzShoes Logo" style={{ maxWidth: '250px', marginBottom: '20px' }} />
          
          <h1 style={{ fontSize: '48px', marginBottom: '16px', textTransform: 'uppercase' }}>Eleva tu Estilo</h1>
          <p style={{ fontSize: '18px', color: 'var(--color-gray)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Descubre las zapatillas más exclusivas de las mejores marcas del mundo. Calidad garantizada.
          </p>
          <Link to="/catalog" className="btn-primary">Explorar Colección</Link>
        </div>
      </section>
      <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '40px' }}>Marcas Destacadas</h2>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.7 }}>
          {['Nike', 'Adidas', 'Puma', 'New Balance', 'ASICS'].map(brand => (
            <h3 key={brand} style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '2px' }}>{brand}</h3>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2>Los Más Buscados</h2>
          <Link to="/catalog" style={{ color: 'var(--color-red)' }}>Ver Todos →</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {featured.map(product => (
            <Link to={`/product/${product.slug}`} key={product.id} style={{
              background: 'var(--color-black-sec)', borderRadius: 'var(--radius)', overflow: 'hidden',
              transition: 'transform 0.3s', display: 'block', textDecoration: 'none', color: 'inherit'
            }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
              
              <div style={{ position: 'relative', height: '250px' }}>
                <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Nota: 'badge' no existe en tu data, por eso quitamos el render condicional o asegúrate de añadir la propiedad al objeto */}
              </div>
              
              <div style={{ padding: '16px' }}>
                <p style={{ color: 'var(--color-gray)', fontSize: '12px', marginBottom: '4px' }}>{product.brand}</p>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{product.name}</h3>
                <p style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}