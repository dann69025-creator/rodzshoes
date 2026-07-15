export const generateWhatsAppLink = (customerData, cart, total) => {
  const phone = "573228819495";
  
  let message = `*NUEVO PEDIDO - RODZSHOES* 👟\n\n`;
  message += `*Datos del Cliente:*\n`;
  message += `👤 Nombre: ${customerData.nombre} ${customerData.apellido}\n`;
  message += `📱 Teléfono: ${customerData.telefono}\n`;
  message += `📍 Ciudad/Barrio: ${customerData.ciudad}, ${customerData.barrio}\n`;
  message += `🏠 Dirección: ${customerData.direccion}\n`;
  if (customerData.notas) message += `📝 Notas: ${customerData.notas}\n`;
  message += `\n*Productos:*\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   - Talla: ${item.size}\n`;
    message += `   - Cantidad: ${item.quantity}\n`;
    message += `   - Precio: $${item.price.toLocaleString('es-CO')}\n`;
  });

  message += `\n*Total a Pagar:* $${total.toLocaleString('es-CO')}\n`;
  message += `*Método de pago:* Contraentrega 📦\n`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};