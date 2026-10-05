import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();

  const copyToClipboard = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      toast.success('ID de pedido copiado');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 text-green-500 rounded-full mb-8">
        <CheckCircle size={48} />
      </div>
      
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
        ¡Tu pedido ha sido recibido!
      </h1>
      <p className="text-slate-600 text-lg mb-8">
        Gracias por tu compra. Estamos procesando tu pedido y pronto nos comunicaremos contigo si es necesario.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 mb-8 inline-block text-left w-full max-w-md mx-auto">
        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2 text-center">
          Número de Pedido
        </p>
        <div className="flex items-center justify-center gap-3 bg-slate-50 py-3 px-4 rounded-md border border-slate-200">
          <span className="font-mono text-xl font-bold text-primary tracking-wider">{id}</span>
          <button 
            onClick={copyToClipboard}
            className="text-slate-400 hover:text-accent transition-colors"
            aria-label="Copiar ID"
          >
            <Copy size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Guarda este ID. Lo necesitarás para rastrear el estado de tu entrega.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/rastreo" className="btn-outline">
          <Package size={20} /> Rastrear Pedido
        </Link>
        <Link to="/catalogo" className="btn-primary">
          Seguir Comprando <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};