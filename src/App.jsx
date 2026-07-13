import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';

const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Product = lazy(() => import('./pages/Product'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Thanks = lazy(() => import('./pages/Thanks'));

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', color: 'white' }}>
            <Header />
            <CartDrawer />
            <div style={{ flex: 1 }}>
              <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Cargando...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:slug" element={<Product />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/thanks" element={<Thanks />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;