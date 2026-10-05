import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatCurrency } from '@/utils/formatCurrency';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Datos del formulario de envío
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: 'Bogotá' // Por defecto
  });

  useEffect(() => {
    const loadedCart = JSON.parse(localStorage.getItem('rodz_cart') || '[]');
    if (loadedCart.length === 0) {
      navigate('/carrito'); // Si no hay nada, lo devolvemos al carrito
      return;
    }
    setCartItems(loadedCart);
    setTotal(loadedCart.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0));
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. GENERAR LA ORDEN EN FIREBASE
      const orderData = {
        cliente: formData.nombre,
        telefono: formData.telefono,
        direccion: `${formData.direccion}, ${formData.ciudad}`,
        items: cartItems,
        total: total,
        estado: 'Pendiente', // El admin lo cambiará luego a Enviado/Entregado
        fecha: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = docRef.id;

      // 2. ENVIAR NOTIFICACIÓN A TELEGRAM
      const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      if (TOKEN && CHAT_ID) {
        let telegramMessage = `🚨 *¡NUEVO PEDIDO EN RODZSHOES!* 🚨\n\n`;
        telegramMessage += `📦 *ID:* \`${orderId}\`\n`;
        telegramMessage += `👤 *Cliente:* ${formData.nombre}\n`;
        telegramMessage += `📞 *Teléfono:* ${formData.telefono}\n`;
        telegramMessage += `📍 *Dirección:* ${formData.direccion}, ${formData.ciudad}\n\n`;
        telegramMessage += `🛒 *Sneakers solicitados:*\n`;
        
        cartItems.forEach((item, index) => {
          telegramMessage += `  ${index + 1}. ${item.nombre} (Talla: ${item.talla}) x${item.cantidad}\n`;
        });

        telegramMessage += `\n💰 *TOTAL:* $${total.toLocaleString('es-CO')} COP`;

        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        });
      } else {
        console.warn("Faltan credenciales de Telegram en el archivo .env");
      }

      // 3. VACIAR EL CARRITO Y REDIRIGIR AL ÉXITO
      localStorage.removeItem('rodz_cart');
      window.dispatchEvent(new Event('storage')); // Actualiza el Navbar a 0
      
      toast.success("¡Pedido realizado con éxito!");
      
      // Enviamos al cliente a la pantalla de confirmación
      navigate(`/pedido-confirmado/${orderId}`);

    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      toast.error("Hubo un error al procesar tu pedido. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <Link to="/carrito" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold uppercase text-xs tracking-wider mb-8 transition-colors">
        <ArrowLeft size={16} /> Volver al Carrito
      </Link>

      <div className="flex items-center gap-3 mb-8 border-b-2 border-slate-100 pb-4">
        <ShieldCheck size={32} className="text-red-600" />
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Checkout Seguro</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Completa tus datos para coordinar el envío</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FORMULARIO DE ENVÍO */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-6 md:p-8 rounded-sm border border-slate-200">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6">Datos de Envío</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nombre Completo</label>
              <input 
                required 
                type="text" 
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" 
                placeholder="Ej: Juan Pérez"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Teléfono / WhatsApp</label>
              <input 
                required 
                type="tel" 
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all font-mono" 
                placeholder="Ej: 300 123 4567"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ciudad</label>
                <input 
                  required 
                  type="text" 
                  value={formData.ciudad}
                  onChange={e => setFormData({...formData, ciudad: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Dirección de Entrega</label>
                <input 
                  required 
                  type="text" 
                  value={formData.direccion}
                  onChange={e => setFormData({...formData, direccion: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" 
                  placeholder="Ej: Calle 85 # 15 - 30, Apto 401"
                />
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Procesando...' : 'Realizar Pedido'} 
                {!isSubmitting && <CheckCircle2 size={20} />}
              </button>
              <p className="text-center text-xs font-medium text-slate-500 mt-4">
                El pago se coordina directamente por WhatsApp tras confirmar el stock.
              </p>
            </div>
          </form>
        </div>

        {/* RESUMEN DEL CARRITO */}
        <div>
          <div className="bg-white border-2 border-slate-200 p-6 md:p-8 rounded-sm sticky top-28">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6 border-b border-slate-100 pb-4">Resumen de Compra</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover bg-slate-50 border border-slate-200 rounded-sm p-1" />
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase line-clamp-1">{item.nombre}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase">Talla: <span className="text-red-600">{item.talla}</span> | Cant: {item.cantidad}</p>
                  </div>
                  <div className="font-black font-mono text-slate-900 text-sm">
                    {formatCurrency(item.precio * item.cantidad)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-slate-900 pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-wider">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-black text-slate-900 uppercase tracking-wider">Total a Pagar</span>
                <span className="font-black font-mono text-red-600 text-2xl">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};