import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Banner } from '../types';

export const getActiveBanners = async (): Promise<Banner[]> => {
  try {
    const q = query(
      collection(db, 'banners'),
      where('activo', '==', true),
      orderBy('orden', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
  } catch (error) {
    console.error("Error fetching active banners:", error);
    return [];
  }
};

export const getAllBannersAdmin = async (): Promise<Banner[]> => {
  try {
    const q = query(collection(db, 'banners'), orderBy('orden', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
  } catch (error) {
    console.error("Error fetching all banners:", error);
    return [];
  }
};