import { STORE_CONFIG } from '../config/store';
import { MapPin, Phone, Mail, Instagram, Clock, MessageSquare } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Contáctanos</h1>
        <p className="text-slate-500 text-lg">
          Estamos aquí para ayudarte a encontrar tu par ideal o resolver cualquier duda sobre tu pedido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Info */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl font-bold text-primary border-b border-slate-100 pb-4">
            Información de Contacto
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Teléfono / WhatsApp</h3>
                <p className="text-slate-600">+57 {STORE_CONFIG.phone}</p>
                <a 
                  href={`https://wa.me/${STORE_CONFIG.whatsapp}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm font-medium text-accent hover:underline mt-1 inline-block"
                >
                  Escríbenos por WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Correo Electrónico</h3>
                <p className="text-slate-600">{STORE_CONFIG.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Ubicación</h3>
                <p className="text-slate-600">{STORE_CONFIG.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">Horario de Atención</h3>
                <p className="text-slate-600">{STORE_CONFIG.schedule}</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <a 
              href={STORE_CONFIG.instagram} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-md hover:bg-slate-800 transition-colors font-medium"
            >
              <Instagram size={20} /> Síguenos en Instagram
            </a>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare size={24} className="text-accent" />
            <h2 className="font-serif text-2xl font-bold text-primary">Envíanos un mensaje</h2>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `mailto:${STORE_CONFIG.email}?subject=Contacto desde Web`;
          }}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input type="text" className="input-field" placeholder="Tu nombre" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input type="email" className="input-field" placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
              <input type="text" className="input-field" placeholder="¿En qué te podemos ayudar?" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
              <textarea className="input-field min-h-[120px] resize-y" placeholder="Escribe tu mensaje aquí..." required></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};