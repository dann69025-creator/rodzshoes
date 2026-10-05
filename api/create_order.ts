import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin } from './_lib/firebaseAdmin';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
};

const generateOrderId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PED-${year}${month}${day}-${randomStr}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { customer, shipping, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 1. Validar productos y precios contra Firestore (Seguridad principal)
    for (const item of items) {
      const productRef = dbAdmin.collection('products').doc(item.productId);
      const productSnap = await productRef.get();

      if (!productSnap.exists) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }

      const productData = productSnap.data();

      if (!productData?.activo || productData.stock < item.quantity) {
        throw new Error(`El producto ${productData?.nombre} no está disponible en la cantidad solicitada.`);
      }

      const itemSubtotal = productData.precio * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: item.productId,
        productName: productData.nombre,
        quantity: item.quantity,
        unitPrice: productData.precio,
        subtotal: itemSubtotal
      });

      // Actualizar stock
      await productRef.update({
        stock: productData.stock - item.quantity
      });
    }

    // 2. Calcular envío
    const shippingCost = subtotal >= 200000 ? 0 : 15000;
    const total = subtotal + shippingCost;
    const orderId = generateOrderId();
    const paymentMethodLabel = paymentMethod === 'cash_on_delivery' ? 'Efectivo contraentrega' : 'Nequi contraentrega';

    // 3. Crear documento de orden
    const orderData = {
      orderId,
      createdAt: new Date(),
      status: 'pending',
      paymentMethod,
      paymentMethodLabel,
      paymentStatus: 'pending',
      customer,
      shipping,
      items: validatedItems,
      subtotal,
      shippingCost,
      total,
      telegramNotificationSent: false,
      statusHistory: [{
        status: 'pending',
        changedAt: new Date(),
        changedBy: 'Sistema'
      }]
    };

    const orderRef = await dbAdmin.collection('orders').add(orderData);

    // 4. Notificar a Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && chatId) {
      const itemsText = validatedItems.map(i => `${i.productName} x${i.quantity} — ${formatCurrency(i.subtotal)}`).join('\n');
      
      const message = `🛍️ *NUEVO PEDIDO*\n\n`
        + `*Pedido:* ${orderId}\n\n`
        + `👤 *Cliente:*\n${customer.name}\n`
        + `📱 *Teléfono:*\n${customer.phone}\n`
        + `📧 *Email:*\n${customer.email}\n\n`
        + `💳 *Método de pago:*\n${paymentMethodLabel}\n\n`
        + `📦 *Productos:*\n${itemsText}\n\n`
        + `💰 *Subtotal:* ${formatCurrency(subtotal)}\n`
        + `🚚 *Envío:* ${formatCurrency(shippingCost)}\n`
        + `💵 *TOTAL: ${formatCurrency(total)}*\n\n`
        + `📍 *Dirección:*\n${shipping.address} ${shipping.additionalInfo || ''}\n🏙️ ${shipping.city}, ${shipping.department}\n\n`
        + `📌 *Estado:* Pendiente`;

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
        await dbAdmin.collection('orders').doc(orderRef.id).update({ telegramNotificationSent: true });
      } catch (telegramError) {
        console.error('Error enviando a Telegram:', telegramError);
        // NO cancelamos la orden si Telegram falla
      }
    }

    return res.status(200).json({ success: true, orderId, docId: orderRef.id });

  } catch (error: any) {
    console.error('Error procesando pedido:', error);
    return res.status(500).json({ error: error.message || 'Error procesando el pedido' });
  }
}