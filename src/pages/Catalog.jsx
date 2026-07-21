import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products } from '../data/products';
import { formatPrice } from '../utils/formatPrice';
import { Search } from 'lucide-react';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  const brandFilter = searchParams.get('brand');
  const sortFilter = searchParams.get('sort');

  let filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (brandFilter ? p.brand === brandFilter : true)
  );

  if (sortFilter === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
  if (sortFilter === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <main className="container" style={{ padding: '40px 20px' }}>
      <Helmet><title>Catálogo | RODZSHOES</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <h1>Catálogo</h1>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Buscar modelo..." 
              className="input-field" 
              style={{ marginBottom: 0, paddingLeft: '40px', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }} />
          </div>
          <select 
            className="input-field" 
            style={{ marginBottom: 0, width: 'auto' }}
            onChange={(e) => setSearchParams(prev => { prev.set('brand', e.target.value); if(!e.target.value) prev.delete('brand'); return prev; })}
            value={brandFilter || ''}
          >
            <option value="">Todas las Marcas</option>
<option value="Nike">Nike</option>
<option value="Adidas">Adidas</option>
<option value="DVS">DVS</option>
<option value="New Balance">New Balance</option>
          </select>
          <select 
            className="input-field" 
            style={{ marginBottom: 0, width: 'auto' }}
            onChange={(e) => setSearchParams(prev => { prev.set('sort', e.target.value); return prev; })}
            value={sortFilter || ''}
          >
            <option value="">Recomendados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '32px' }}>
        {filteredProducts.map(product => (
          <Link to={`/product/${product.slug}`} key={product.id} className="fade-in" style={{
            background: 'var(--color-black-sec)', borderRadius: 'var(--radius)', overflow: 'hidden',
            transition: 'transform 0.3s', display: 'block'
          }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ position: 'relative', height: '280px' }}>
              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ color: 'var(--color-gray)', fontSize: '12px', marginBottom: '4px' }}>{product.brand}</p>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{product.name}</h3>
              <p style={{ color: 'var(--color-red)', fontWeight: 'bold', fontSize: '18px' }}>{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
      {filteredProducts.length === 0 && <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-gray)' }}>No se encontraron productos.</p>}
    </main>
  );
}