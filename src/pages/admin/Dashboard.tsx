import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { formatCurrency } from '@/utils/formatCurrency';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DollarSign, ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ventasTotales: 0,
    pedidosTotales: 0,
    pedidosPendientes: 0,
    productosActivos: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Obtener total de productos
        const productsSnap = await getDocs(collection(db, 'products'));
        const totalProductos = productsSnap.docs.filter(doc => doc.data().activo).length;

        // 2. Obtener todos los pedidos para estadísticas
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let ingresos = 0;
        let pendientes = 0;
        
        ordersSnap.forEach(doc => {
          const data = doc.data();
          // Sumar ventas solo de los que no estén cancelados
          if (data.estado !== 'Cancelado') {
            ingresos += (data.total || 0);
          }
          if (!data.estado || data.estado === 'Pendiente') {
            pendientes++;
          }
        });

        setStats({
          ventasTotales: ingresos,
          pedidosTotales: ordersSnap.size,
          pedidosPendientes: pendientes,
          productosActivos: totalProductos
        });

        // 3. Obtener los 5 pedidos más recientes
        const qRecent = query(collection(db, 'orders'), orderBy('fecha', 'desc'), limit(5));
        const recentSnap = await getDocs(qRecent);
        
        const recentList = recentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRecentOrders(recentList);

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Función para darle color al estado del pedido
const getStatusBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'enviado':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'empacado':
        return 'bg-purple-100 text-purple-700 border-purple-200'; // Nuevo morado
      case 'cancelado':
        return 'bg-slate-200 text-slate-600 border-slate-200';
      default:
        return 'bg-red-50 text-red-600 border-red-200'; // Pendiente
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-full">
      <div className="mb-8 border-b-2 border-slate-100 pb-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Panel Principal</h1>
        <p className="text-slate-500 font-medium mt-1">Resumen general de tu tienda RodzShoes</p>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-red-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ingresos Brutos</p>
              <h3 className="text-2xl font-black font-mono text-slate-900">{formatCurrency(stats.ventasTotales)}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-sm">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pedidos</p>
              <h3 className="text-2xl font-black font-mono text-slate-900">{stats.pedidosTotales}</h3>
            </div>
            <div className="p-3 bg-slate-50 text-slate-600 rounded-sm">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pendientes de Envío</p>
              <h3 className="text-2xl font-black font-mono text-amber-600">{stats.pedidosPendientes}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-sm">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sneakers Activos</p>
              <h3 className="text-2xl font-black font-mono text-slate-900">{stats.productosActivos}</h3>
            </div>
            <div className="p-3 bg-slate-50 text-slate-600 rounded-sm">
              <Package size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* SECCIÓN DE ÚLTIMOS PEDIDOS */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={20} className="text-red-600" /> Movimientos Recientes
          </h2>
          <Link to="/admin/orders" className="text-xs font-bold text-slate-500 hover:text-red-600 uppercase tracking-wider transition-colors underline">
            Ver Todos
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID Pedido</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Aún no hay pedidos para mostrar.
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-black text-xs text-slate-900">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-slate-900">
                      {order.cliente}
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-slate-900 text-xs">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider ${getStatusBadge(order.estado)}`}>
                        {order.estado || 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};