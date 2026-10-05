import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatCurrency';
import { Package, Trash2, Eye, X, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      toast.error("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { estado: newStatus });
      toast.success(`Estado actualizado a: ${newStatus}`);
      fetchOrders(); 
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        toast.success('Pedido eliminado correctamente');
        fetchOrders();
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar el pedido');
      }
    }
  };

  // NUEVA FUNCIÓN DE COLORES (Incluye "Empacado")
  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-700';
      case 'enviado':
        return 'bg-blue-100 text-blue-700';
      case 'empacado':
        return 'bg-purple-100 text-purple-700'; // Morado para Empacado
      case 'cancelado':
        return 'bg-slate-200 text-slate-600';
      default:
        return 'bg-amber-100 text-amber-700'; // Pendiente por defecto
    }
  };

  if (loading && orders.length === 0) return <LoadingSpinner />;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 border-b-2 border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Pedidos <span className="text-red-600">Rodz</span></h1>
          <p className="text-slate-500 font-medium mt-1">Gestión de ventas y envíos</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-sm font-bold uppercase tracking-wider text-sm flex items-center gap-2">
          <Package size={18} /> {orders.length} Pedidos
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-white border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">ID / Fecha</th>
                <th className="px-6 py-4 font-bold">Cliente</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay pedidos registrados todavía.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-black text-slate-900 text-xs">{order.id.slice(0, 8)}...</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {order.fecha ? new Date(order.fecha.toDate()).toLocaleDateString('es-CO') : 'Reciente'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 uppercase text-xs">{order.cliente}</p>
                      <p className="text-xs text-slate-500 font-medium">{order.ciudad || order.direccion?.split(',')[1]}</p>
                    </td>
                    <td className="px-6 py-4 font-black font-mono text-slate-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      {/* AQUÍ ESTÁN LAS NUEVAS OPCIONES DE ESTADO */}
                      <select 
                        value={order.estado || 'Pendiente'} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider outline-none border-none cursor-pointer appearance-none ${getStatusColor(order.estado)}`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Empacado">Empacado</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setSelectedOrder(order)} className="text-slate-400 hover:text-slate-900 transition-colors">
                          <Eye size={20} />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE DETALLES DEL PEDIDO (Mismo que antes) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden border-t-4 border-red-600 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white flex-shrink-0">
              <h3 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <Package size={20} className="text-red-600" /> Detalles del Pedido
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white transition-colors p-1">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-sm border border-slate-200">
                <div className="flex gap-3">
                  <MapPin className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente y Envío</p>
                    <p className="text-sm font-black text-slate-900 uppercase mt-1">{selectedOrder.cliente}</p>
                    <p className="text-sm text-slate-600 font-medium mt-0.5">{selectedOrder.direccion}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contacto</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-1">{selectedOrder.telefono}</p>
                    <a href={`https://wa.me/57${selectedOrder.telefono.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:text-green-700 font-bold uppercase tracking-wider mt-1 inline-block">
                      Escribir al WhatsApp
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Sneakers Solicitados</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center border border-slate-200 p-3 rounded-sm">
                      <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover bg-slate-50 rounded-sm" />
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 uppercase line-clamp-1">{item.nombre}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase mt-1">Talla: <span className="text-red-600">{item.talla}</span> | Cant: {item.cantidad}</p>
                      </div>
                      <p className="font-mono font-black text-slate-900 text-sm">{formatCurrency(item.precio * item.cantidad)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado Actual</p>
                  <p className={`inline-block px-2 py-1 mt-1 rounded-sm text-[10px] font-black uppercase tracking-wider ${getStatusColor(selectedOrder.estado)}`}>
                    {selectedOrder.estado || 'Pendiente'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total del Pedido</p>
                  <p className="text-2xl font-black font-mono text-red-600 mt-1">{formatCurrency(selectedOrder.total)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};