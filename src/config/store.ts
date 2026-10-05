export const STORE_CONFIG = {
  name: "RodzShoes",
  description: "Zapatillas Sneakers 1:1 de lujo.",
  email: "adminrodzshoes@gmail.com",
  phone: "3228819495",
  whatsapp: "573228819495",
  nequiNumber: "3228819495",
  instagram: "https://instagram.com/rodzshoes",
  address: "Bogotá, Colombia",
  schedule: "Lunes a Sábado: 10:00 AM - 6:00 PM",
  shippingCost: 15000,
  freeShippingThreshold: 200000, // Envío gratis por compras mayores a esto
  whatsappDefaultMessage: "Hola, estoy interesado en comprar un par de sneakers y quisiera recibir asesoría."
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "En preparación",
  ready: "Listo para envío",
  shipped: "Enviado",
  in_transit: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado"
};