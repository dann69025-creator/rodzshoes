import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-slate-100">
      <Link to={`/producto/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-primary text-white px-4 py-2 uppercase tracking-widest text-xs font-bold rounded-sm">
              Agotado
            </span>
          </div>
        )}
        {!isOutOfStock && product.precioAnterior && (
          <div className="absolute top-4 left-4">
            <span className="bg-accent text-white px-3 py-1 text-xs font-bold tracking-wider rounded-sm shadow-sm">
              OFERTA
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        {product.marca && (
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
            {product.marca}
          </span>
        )}
        <Link to={`/producto/${product.id}`} className="hover:text-accent transition-colors">
          <h3 className="font-serif text-lg font-medium text-primary mb-2 line-clamp-2">
            {product.nombre}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(product.precio)}
            </span>
            {product.precioAnterior && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(product.precioAnterior)}
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) addToCart(product);
            }}
            disabled={isOutOfStock}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-accent hover:shadow-md'
            }`}
            aria-label="Agregar al carrito"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};