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
        background: 'var(--color-black-sec)', width: '100%', maxWidth: '500px',
        borderRadius: '12px', padding: '24px', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: '#fff' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '24px' }}>Guía de Tallas</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ padding: '12px', color: 'var(--color-gray)' }}>EUR</th>
              <th style={{ padding: '12px', color: 'var(--color-gray)' }}>US</th>
              <th style={{ padding: '12px', color: 'var(--color-gray)' }}>CM</th>
            </tr>
          </thead>
          <tbody>
            {[['40', '7', '25'], ['41', '8', '26'], ['42', '8.5', '26.5'], ['43', '9.5', '27.5'], ['44', '10', '28']].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{row[0]}</td>
                <td style={{ padding: '12px' }}>{row[1]}</td>
                <td style={{ padding: '12px' }}>{row[2]} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}