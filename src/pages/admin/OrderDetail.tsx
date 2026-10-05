import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderTracking, updateOrderStatusAdmin } from '../../services/orderService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order, OrderStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUS_LABELS } from '../../config/store';
import toast from 'react-hot-toast';
import { ArrowLeft, User, MapPin, CreditCard, Package, Clock } from 'lucide-react';

export const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    const data = await getOrderTracking(orderId);
    setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || !order.id || !currentUser?.email) return;
    
    const confirmChange = window.confirm(`¿Estás seguro de cambiar el estado a "${ORDER_STATUS_LABELS[newStatus]}"?`);
    if (!confirmChange) return;

    setIsUpdating(true);
    try {
      // Llamamos a la API para asegurar que se actualice la DB y se envíe la notificación de Telegram
      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: order.id,
          orderId: order.orderId,
          newStatus,
          adminEmail: currentUser.email,
          customerName: order.customer.name
        })
      });

      if (!response.ok) {
        // Si no existe la API (ejecución puramente local sin Vercel), hacemos el fallback a Firestore directo.
        console.warn('API no disponible, actualizando directamente en Firestore.');
        await updateOrderStatusAdmin(order.id, newStatus, currentUser.email);
      }
      
      toast.success('Estado actualizado correctamente');
      fetchOrder();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async () => {
    if (!order || !order.id) return;
    const newStatus = order.paymentStatus === 'paid' ? 'pending' : 'paid';
    
    const confirmChange = window.confirm(`¿Marcar el pago como "${newStatus === 'paid' ? 'Pagado' : 'Pendiente'}"?`);
    if (!confirmChange) return;

    setIsUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { paymentStatus: newStatus });
      toast.success('Estado de pago actualizado');
      fetchOrder();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el pago');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="p-8 text-center text-slate-500">Pedido no encontrado</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/admin/pedidos')}
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Volver a pedidos
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary font-mono">{order.orderId}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Clock size={16} />
            {order.createdAt?.toDate().toLocaleString('es-CO')}
          </p>
        </div>
        
        {/* Controles de Estado */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estado del Pedido</label>
            <select
              disabled={isUpdating}
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="input-field py-1.5 text-sm font-medium border-slate-300"
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Detalles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Package size={20} className="text-slate-400" />
              <h2 className="font-bold text-primary">Productos</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <li key={idx} className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {item.quantity}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="text-sm text-slate-500">{formatCurrency(item.unitPrice)} c/u</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(item.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="bg-slate-50 p-6 border-t border-slate-200">
              <div className="flex justify-between text-slate-600 mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 mb-4">
                <span>Costo de envío</span>
                <span>{order.shippingCost === 0 ? 'Gratis' : formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-primary font-bold text-xl pt-4 border-t border-slate-200">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Historial de Estados */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-primary">Historial de Estados</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {order.statusHistory?.map((history, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== order.statusHistory.length - 1 && (
                      <div className="absolute left-2.5 top-6 w-px h-full bg-slate-200"></div>
                    )}
                    <div className="w-5 h-5 rounded-full bg-accent/20 border-2 border-accent shrink-0 z-10 mt-0.5"></div>
                    <div>
                      <p className="font-bold text-slate-900">{ORDER_STATUS_LABELS[history.status]}</p>
                      <p className="text-xs text-slate-500">
                        {history.changedAt?.toDate().toLocaleString('es-CO')} — por {history.changedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Cliente y Pago */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <User size={20} className="text-slate-400" />
              <h2 className="font-bold text-primary">Cliente</h2>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <p><span className="text-slate-500 block mb-1">Nombre:</span> <span className="font-medium text-slate-900">{order.customer.name}</span></p>
              <p><span className="text-slate-500 block mb-1">Email:</span> <span className="font-medium text-slate-900">{order.customer.email}</span></p>
              <p><span className="text-slate-500 block mb-1">Teléfono:</span> <span className="font-medium text-slate-900">{order.customer.phone}</span></p>
            </div>
          </div>

          {/* Envío */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <MapPin size={20} className="text-slate-400" />
              <h2 className="font-bold text-primary">Dirección de Entrega</h2>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <p className="font-medium text-slate-900">{order.shipping.address}</p>
              {order.shipping.additionalInfo && <p className="text-slate-600">{order.shipping.additionalInfo}</p>}
              <p className="text-slate-600">{order.shipping.city}, {order.shipping.department}</p>
            </div>
          </div>

          {/* Pago */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <CreditCard size={20} className="text-slate-400" />
              <h2 className="font-bold text-primary">Información de Pago</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Método</p>
                <p className="font-medium text-slate-900">{order.paymentMethodLabel}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">Estado Actual</p>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md border border-slate-100">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                  <button
                    disabled={isUpdating}
                    onClick={handlePaymentStatusChange}
                    className="text-xs font-medium text-accent hover:underline disabled:opacity-50"
                  >
                    Marcar como {order.paymentStatus === 'paid' ? 'Pendiente' : 'Pagado'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};