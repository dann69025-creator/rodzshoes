import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; 
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar los pedidos al iniciar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ordenes"));
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };

    fetchOrders();
  }, []);

  // 2. Función para actualizar el estado en Firebase
  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const orderRef = doc(db, "ordenes", orderId);
      // Actualizamos el documento específico en Firestore
      await updateDoc(orderRef, {
        status: newStatus
      });
      
      // Actualizamos el estado local para que el cambio se vea al instante
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      alert("¡Estado actualizado con éxito!");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al guardar el cambio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-orders-container">
      <h1>Gestión de Pedidos</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Estado Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.clienteName || "Sin nombre"}</td>
              <td>{order.status || "Pendiente"}</td>
              <td>
                <select 
                  className="status-select"
                  disabled={loading}
                  defaultValue={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;