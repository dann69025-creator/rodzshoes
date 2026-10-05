import { MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

export const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(STORE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
};