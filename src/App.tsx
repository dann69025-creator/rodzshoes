import { Routes, Route } from 'react-router-dom';

// Layouts (Usando el alias @/ para evitar errores de rutas relativas)
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Páginas Públicas
import { Home } from '@/pages/Home';
import { Catalog } from '@/pages/Catalog';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { OrderConfirmation } from '@/pages/OrderConfirmation';
import { Tracking } from '@/pages/Tracking';
import { Contact } from '@/pages/Contact';

// Páginas de Administración
import { Login } from '@/pages/admin/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Orders } from '@/pages/admin/Orders';
import { OrderDetail } from '@/pages/admin/OrderDetail';
import { Products } from '@/pages/admin/Products';
import { Banners } from '@/pages/admin/Banners';

function App() {
  return (
    <Routes>
      {/* =======================
          RUTAS PÚBLICAS 
          ======================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado/:id" element={<OrderConfirmation />} />
        <Route path="/rastreo" element={<Tracking />} />
        <Route path="/contacto" element={<Contact />} />
      </Route>

      {/* =======================
          RUTAS DE ADMINISTRACIÓN 
          ======================= */}
      <Route path="/admin/login" element={<Login />} />
      
      {/* Todo lo que esté dentro de AdminLayout requiere sesión iniciada */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/pedidos" element={<Orders />} />
        <Route path="/admin/pedidos/:orderId" element={<OrderDetail />} />
        <Route path="/admin/productos" element={<Products />} />
        <Route path="/admin/banners" element={<Banners />} />
      </Route>
      
      {/* =======================
          ERROR 404 (NO ENCONTRADO) 
          ======================= */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center text-center px-4 bg-slate-50">
          <div>
            <h1 className="text-6xl font-serif text-slate-900 font-bold mb-4">404</h1>
            <p className="text-slate-500 text-lg mb-8">La página que buscas no existe o fue movida.</p>
            <a 
              href="/" 
              className="inline-flex items-center justify-center bg-slate-900 text-white font-medium py-3 px-6 rounded-md hover:bg-slate-800 transition-colors"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;