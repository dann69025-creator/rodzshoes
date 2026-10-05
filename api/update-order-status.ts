import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin } from './_lib/firebaseAdmin';

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "En preparación",
  ready: "Listo para envío",
  shipped: "Enviado",
  in_transit: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { docId, orderId, newStatus, adminEmail, customerName } = req.body;

    if (!docId || !newStatus || !adminEmail) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const orderRef = dbAdmin.collection('orders').doc(docId);
    
    // Obtener estado anterior
    const docSnap = await orderRef.get();
    const oldStatus = docSnap.exists ? docSnap.data()?.status : 'Desconocido';

    // Actualizar Firebase
    await orderRef.update({
      status: newStatus,
      statusHistory: dbAdmin.FieldValue.arrayUnion({
        status: newStatus,
        changedAt: new Date(),
        changedBy: adminEmail
      })
    });

    // Enviar notificación a Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && chatId) {
      const message = `🔄 *PEDIDO ACTUALIZADO*\n\n`
        + `*Pedido:* ${orderId}\n`
        + `*Cliente:* ${customerName}\n\n`
        + `*Estado anterior:*\n${STATUS_LABELS[oldStatus] || oldStatus}\n\n`
        + `*Nuevo estado:*\n${STATUS_LABELS[newStatus] || newStatus}\n\n`
        + `*Administrador:*\n${adminEmail}`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
      } catch (e) {
        console.error('Error enviando a Telegram:', e);
      }
    }

    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('Error actualizando pedido:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}