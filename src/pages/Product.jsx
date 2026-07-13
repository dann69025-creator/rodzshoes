import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import SizeGuide from '../components/SizeGuide/SizeGuide';
import { Helmet } from 'react-helmet-async';

export default function Product() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validación si el producto no existe
  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        Producto no encontrado
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Por favor selecciona una talla');
      return;
    }
    setError('');
    addToCart(product, selectedSize);
  };

  return (
    <main className="container" style={{ padding: '60px 20px' }}>
      <Helmet>
        <title>{product.name} | RODZSHOES</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
        
        {/* Sección Visual: GIF + Galería */}
        <div className="fade-in">
          {/* Visualización segura del GIF */}
          {product.gif && (
            <img 
              src={product.gif} 
              alt={`${product.name} GIF`} 
              style={{ width: '100%', borderRadius: '12px', marginBottom: '16px', objectFit: 'cover' }}
            />
          )}

          {/* Visualización segura de las imágenes */}
          <div className="gallery product-gallery">
            {(product.images || []).map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${product.name} - Vista ${index + 1}`} 
                style={{ width: '100%', marginBottom: '10px', borderRadius: '12px', objectFit: 'cover' }} 
              />
            ))}
          </div>
        </div>

        {/* Info del Producto */}
        <div className="fade-in">
          <p style={{ color: 'var(--color-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {product.brand}
          </p>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-red)' }}>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span style={{ textDecoration: 'line-through', color: 'var(--color-gray)' }}>
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

{/* Selección de Tallas */}
<div style={{ marginBottom: '32px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
    <span style={{ fontWeight: '600' }}>Selecciona tu talla (EUR)</span>
    <button 
      onClick={() => setShowSizeGuide(true)} 
      style={{ color: 'var(--color-gray)', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
    >
      Guía de tallas
    </button>
  </div>
  
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    {(product.sizes || []).map(size => (
      <button 
        key={size}
        onClick={() => { setSelectedSize(size); setError(''); }}
        style={{
          padding: '12px 20px', 
          border: `1px solid ${selectedSize === size ? 'var(--color-red)' : '#333'}`,
          background: selectedSize === size ? 'var(--color-red)' : 'transparent',
          color: '#fff', 
          borderRadius: '4px', 
          transition: 'var(--transition)',
          cursor: 'pointer'
        }}
      >
        {size} EU
      </button>
    ))}
  </div>
  {error && <p style={{ color: 'var(--color-red)', marginTop: '8px', fontSize: '14px' }}>{error}</p>}
</div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '16px', marginBottom: '40px', cursor: 'pointer' }} 
            onClick={handleAddToCart}
          >
            Agregar al Carrito
          </button>

          {/* Descripción y Especificaciones */}
          <div>
            <h3 style={{ marginBottom: '16px' }}>Descripción</h3>
            <p style={{ color: 'var(--color-gray)', lineHeight: '1.6', marginBottom: '24px' }}>{product.description}</p>
            
            <h3 style={{ marginBottom: '16px' }}>Especificaciones</h3>
            <ul style={{ color: 'var(--color-gray)', paddingLeft: '20px', lineHeight: '1.8' }}>
              {(product.specifications || []).map((spec, i) => <li key={i}>{spec}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </main>
  );
}