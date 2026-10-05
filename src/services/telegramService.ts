export const sendTelegramNotification = async (orderData: {
  id: string;
  cliente: string;
  telefono: string;
  direccion: string;
  total: number;
  items: Array<{ nombre: string; talla: string; cantidad: number }>;
}) => {
  const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    console.warn("Telegram no está configurado en las variables de entorno.");
    return;
  }

  // Construimos el mensaje con diseño limpio
  let message = `🚨 *¡NUEVO PEDIDO EN RODZSHOES!* 🚨\n\n`;
  message += `📦 *Pedido ID:* ${orderData.id}\n`;
  message += `👤 *Cliente:* ${orderData.cliente}\n`;
  message += `📞 *Teléfono:* ${orderData.telefono}\n`;
  message += `📍 *Dirección:* ${orderData.direccion}\n\n`;
  message += `🛒 *Pares solicitados:*\n`;
  
  orderData.items.forEach((item, index) => {
    message += `  ${index + 1}. ${item.nombre} (Talla: ${item.talla}) x${item.cantidad}\n`;
  });

  message += `\n💰 *Total a cobrar:* $${orderData.total.toLocaleString()} COP`;

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error("Error al enviar notificación a Telegram:", error);
  }
};