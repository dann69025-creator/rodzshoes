import React from 'react';
import { X } from 'lucide-react';

export default function SizeGuide({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="fade-in" style={{
        background: '#FFFFFF', 
        width: '100%', maxWidth: '500px',
        borderRadius: '12px', padding: '24px', position: 'relative',
        maxHeight: '90vh', overflowY: 'auto' /* Por si la tabla crece mucho en celulares pequeños */
      }}>
        
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', top: '16px', right: '16px', 
            color: '#111111', background: 'transparent', border: 'none', cursor: 'pointer' 
          }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px', color: '#111111' }}>Guía de Tallas</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '12px', color: '#6B7280' }}>EUR</th>
              <th style={{ padding: '12px', color: '#6B7280' }}>CO</th>
              <th style={{ padding: '12px', color: '#6B7280' }}>US</th>
              <th style={{ padding: '12px', color: '#6B7280' }}>CM</th>
            </tr>
          </thead>
          <tbody>
            {/* Arreglo con números enteros y medios basados en la tabla oficial */}
            {[
              ['40', '38', '7', '25'], 
              ['40.5', '38.5', '7.5', '25.5'], 
              ['41', '39', '8', '26'], 
              ['42', '39.5', '8.5', '26.5'], 
              ['42.5', '40', '9', '27'], 
              ['43', '40.5', '9.5', '27.5'], 
              ['44', '41', '10', '28'],
              ['44.5', '41.5', '10.5', '28.5']
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #E5E7EB', color: '#111111' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{row[0]}</td>
                <td style={{ padding: '12px' }}>{row[1]}</td>
                <td style={{ padding: '12px' }}>{row[2]}</td>
                <td style={{ padding: '12px' }}>{row[3]} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}