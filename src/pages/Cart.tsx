import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  talla: string;
  cantidad: number;
}

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Leer carrito al cargar la página
    const loadedCart = JSON.parse(localStorage.getItem('rodz_cart') || '[]');
    setCartItems(loadedCart);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('rodz_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage')); // Avisar al Navbar
  };

  const updateQuantity = (id: string, talla: string, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id && item.talla === talla) {
        const newQuantity = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQuantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id: string, talla: string) => {
    const newCart = cartItems.filter(item => !(item.id === id && item.talla === talla));
    saveCart(newCart);
    toast.success("Sneaker eliminado del carrito");
  };

  const total = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 font-medium mb-8">Aún no has agregado ningún par a tu colección.</p>
        <Link to="/catalogo" className="bg-red-600 text-white px-8 py-4 rounded-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg">
          Explorar Sneakers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-8 border-b-2 border-slate-100 pb-4">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LISTA DE PRODUCTOS */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${item.talla}-${index}`} className="flex flex-col sm:flex-row gap-6 bg-white border border-slate-200 p-4 rounded-sm shadow-sm relative group">
              
              <div className="w-full sm:w-32 h-32 bg-slate-50 border border-slate-200 rounded-sm p-2 flex-shrink-0 flex items-center justify-center">
                <img src={item.imagen} alt={item.nombre} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1">{item.nombre}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Talla: <span className="text-red-600">{item.talla}</span></p>
                  <p className="text-lg font-black font-mono text-slate-900">{formatCurrency(item.precio)}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border-2 border-slate-200 rounded-sm">
                    <button onClick={() => updateQuantity(item.id, item.talla, -1)} className="p-2 hover:bg-slate-100 hover:text-red-600 transition-colors">
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id, item.talla, 1)} className="p-2 hover:bg-slate-100 hover:text-red-600 transition-colors">
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id, item.talla)}
                    className="text-slate-400 hover:text-red-600 p-2 transition-colors flex items-center gap-1 text-xs font-bold uppercase"
                  >
                    <Trash2 size={18} /> <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN DE COMPRA */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm sticky top-28">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6 border-b border-slate-200 pb-4">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6 text-sm font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.cantidad, 0)} pares)</span>
                <span className="font-mono text-slate-900">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span className="text-green-600 font-bold uppercase tracking-wider text-xs">¡Gratis!</span>
              </div>
            </div>

            <div className="border-t-2 border-slate-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-base font-black uppercase tracking-wider text-slate-900">Total</span>
                <span className="text-2xl font-black font-mono text-red-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Ir a Pagar <ArrowRight size={20} />
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/catalogo" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 transition-colors underline">
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};