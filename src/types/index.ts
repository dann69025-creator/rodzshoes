import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  imagen: string;       // Imagen principal (para compatibilidad)
  imagenes?: string[];  // Las 3 vistas del producto
  categoria: string;
  marca: string;
  genero: string;
  ml: number | string;  // Talla EUR
  stock: number;
  activo: boolean;
  destacado: boolean;
  especificaciones?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cash_on_delivery" | "nequi_on_delivery";
export type PaymentStatus = "pending" | "paid";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  changedAt: Timestamp;
  changedBy: string;
}

export interface Order {
  id?: string; // Document ID
  orderId: string; // Human readable
  createdAt: Timestamp;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
  paymentStatus: PaymentStatus;
  
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  
  shipping: {
    address: string;
    city: string;
    department: string;
    additionalInfo?: string;
  };
  
  items: OrderItem[];
  
  subtotal: number;
  shippingCost: number;
  total: number;
  
  telegramNotificationSent: boolean;
  statusHistory: StatusHistoryItem[];
}

export interface Banner {
  id: string;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  imagen: string;
  precioAnterior?: number;
  precioNuevo?: number;
  descuento?: number;
  botonTexto: string;
  link: string;
  activo: boolean;
  orden: number;
  fechaInicio?: Timestamp;
  fechaFin?: Timestamp;
}

export interface AdminUser {
  email: string;
  role: "admin";
  active: boolean;
  createdAt: Timestamp;
}