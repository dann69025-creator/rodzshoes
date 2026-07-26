import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import SizeGuide from '../components/SizeGuide/SizeGuide';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Product() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para controlar la diapositiva activa del carrusel
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
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

  // Combinamos el GIF (si existe) y las imágenes en un solo arreglo multimedia
  const mediaItems = [
    ...(product.gif ? [product.gif] : []),
    ...(product.images || [])
  ];

  return (
    <main className="container" style={{ padding: '60px 20px' }}>
      <Helmet>
        <title>{product.name} | RODZSHOES</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
        
        {/* Sección Visual: Carrusel Unificado (GIF + Imágenes) */}
        <div className="fade-in">
          {mediaItems.length > 0 && (
            <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
              
              {/* Elemento Activo (GIF o Imagen) */}
              <img 
                src={mediaItems[currentImgIndex]} 
                alt={`${product.name} - Vista ${currentImgIndex + 1}`} 
                style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '1/1' }} 
              />

              {/* Controles del Carrusel (Solo si hay más de 1 elemento en total) */}
              {mediaItems.length > 1 && (
                <>
                  {/* Botón Izquierda */}
                  <button 
                    onClick={() => setCurrentImgIndex(prev => prev === 0 ? mediaItems.length - 1 : prev - 1)}
                    style={{
                      position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%',
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'var(--transition)'
                    }}
                  >
                    <ChevronLeft size={24} color="#111111" />
                  </button>

                  {/* Botón Derecha */}
                  <button 
                    onClick={() => setCurrentImgIndex(prev => prev === mediaItems.length - 1 ? 0 : prev + 1)}
                    style={{
                      position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%',
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'var(--transition)'
                    }}
                  >
                    <ChevronRight size={24} color="#111111" />
                  </button>

                  {/* Puntos indicadores (Dots) */}
                  <div style={{
                    position: 'absolute', bottom: '16px', left: '0', right: '0',
                    display: 'flex', justifyContent: 'center', gap: '8px'
                  }}>
                    {mediaItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImgIndex(idx)}
                        style={{
                          width: '10px', height: '10px', borderRadius: '50%', border: 'none', padding: 0,
                          backgroundColor: currentImgIndex === idx ? 'var(--color-red)' : 'rgba(255, 255, 255, 0.7)',
                          cursor: 'pointer', transition: 'background-color 0.3s'
                        }}
                        aria-label={`Ir a diapositiva ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
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
              <span style={{ fontWeight: '600', color: '#111111' }}>
                Selecciona tu talla (EUR)
              </span>
              <button 
                onClick={() => setShowSizeGuide(true)} 
                style={{ 
                  color: '#6B7280', 
                  textDecoration: 'underline', 
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer',
                  fontWeight: '500' 
                }}
              >
                Guía de tallas
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {(product.sizes || []).map(size => (
                <button 
                  key={size}
                  onClick={() => { setSelectedSize(size); setError(''); }}
                  style={{
                    padding: '12px 20px', 
                    border: `1px solid ${selectedSize === size ? 'var(--color-red)' : '#333'}`,
                    background: selectedSize === size ? 'var(--color-red)' : 'transparent',
                    color: selectedSize === size ? '#FFFFFF' : '#111111',
                    borderRadius: '4px', 
                    transition: 'var(--transition)',
                    cursor: 'pointer'
                  }}
                >
                  {size} EU
                </button>
              ))}
            </div>

            {/* Mensaje de recomendación de talla */}
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#F3F4F6', 
              borderRadius: '8px', 
              borderLeft: '4px solid #111111' 
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: '1.6' }}>
                <strong>💡 Consejo de talla:</strong> Te recomendamos elegir la talla de zapatillas de número entero, el que viene después del medio. Por ejemplo, si tu resultado fue 40.5 y esta no aparece en las opciones, opta por una 41, con seguridad será la adecuada y no sentirás una gran diferencia al medírtelos.
              </p>
            </div>

            {error && <p style={{ color: 'var(--color-red)', marginTop: '12px', fontSize: '14px', fontWeight: '500' }}>{error}</p>}
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