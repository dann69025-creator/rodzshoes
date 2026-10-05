import { collection, getDocs, doc, getDoc, query, orderBy, where, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Order, OrderStatus } from '../types';

export const getOrderTracking = async (orderId: string): Promise<Order | null> => {
  try {
    // Buscamos la orden por su ID legible humano
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error tracking order:", error);
    return null;
  }
};

export const getAllOrdersAdmin = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

export const updateOrderStatusAdmin = async (docId: string, newStatus: OrderStatus, adminEmail: string) => {
  try {
    const orderRef = doc(db, 'orders', docId);
    await updateDoc(orderRef, {
      status: newStatus,
      statusHistory: arrayUnion({
        status: newStatus,
        changedAt: Timestamp.now(),
        changedBy: adminEmail
      })
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};