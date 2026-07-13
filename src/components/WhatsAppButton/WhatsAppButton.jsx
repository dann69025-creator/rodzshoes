import React from 'react'; 
export default function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/573228819495?text=Hola,%20necesito%20asesoría%20con%20una%20compra%20en%20RODZSHOES" 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        backgroundColor: '#25D366', color: 'white',
        width: '60px', height: '60px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 90,
        transition: 'transform 0.3s ease'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.161.453-.834.864-1.191.954-.316.079-.728.14-2.146-.445-1.558-.646-2.576-2.228-2.653-2.33-.075-.102-.634-.844-.634-1.611 0-.767.399-1.146.541-1.296.141-.15.305-.187.408-.187.102 0 .204 0 .292.004.093.005.213-.035.334.254.125.301.428 1.049.467 1.127.039.079.066.173.015.274-.051.101-.077.163-.153.253-.076.091-.161.199-.228.275-.074.085-.152.179-.064.331.087.151.391.646.837 1.047.575.516 1.055.674 1.201.745.146.071.233.061.32-.039.087-.101.378-.445.479-.597.101-.153.201-.128.34-.076.139.052.883.416 1.034.492.152.076.252.114.289.178.037.064.037.37-.124.823z"/>
      </svg>
    </a>
  );
}