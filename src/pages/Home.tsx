import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/firebase/config';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface BannerData {
  id: string;
  titulo: string;
  subtitulo: string;
  imagen: string;
  link: string;
  activo: boolean;
}

export const Home = () => {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const bannerQ = query(collection(db, 'banners'), where('activo', '==', true), limit(1));
        const bannerSnap = await getDocs(bannerQ);
        if (!bannerSnap.empty) {
          setBanner({ id: bannerSnap.docs[0].id, ...bannerSnap.docs[0].data() } as BannerData);
        }

        const prodQ = query(
          collection(db, 'products'), 
          where('activo', '==', true), 
          where('destacado', '==', true), 
          limit(4)
        );
        const prodSnap = await getDocs(prodQ);
        const prods = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(prods);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-full bg-white">
      {/* SECCIÓN HERO BANNER - Estilo Blanco y Rojo */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-slate-50 flex items-center justify-center overflow-hidden border-b-4 border-red-600">
        <img 
          src={banner?.imagen || '/images/banners/default-sneakers.jpg'} 
          alt={banner?.titulo || 'RodzShoes'} 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Capa oscura sutil para que el texto resalte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-20">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-xl uppercase tracking-tight">
            {banner?.titulo || 'Pisa Fuerte con RodzShoes'}
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-8 drop-shadow-md font-medium">
            {banner?.subtitulo || 'Los sneakers más exclusivos y limitados del mercado.'}
          </p>
          <Link 
            to={banner?.link || "/catalogo"} 
            className="bg-red-600 text-white hover:bg-red-700 px-8 py-4 rounded-sm font-bold text-lg transition-colors inline-flex items-center gap-2 shadow-lg uppercase tracking-wider"
          >
            Ver Colección <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* SECCIÓN PRODUCTOS DESTACADOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex justify-between items-end mb-10 border-b-2 border-slate-100 pb-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Lo Más <span className="text-red-600">Fuego</span></h2>
            <p className="text-slate-500 font-medium">Nuestros pares más exclusivos y vendidos</p>
          </div>
          <Link to="/catalogo" className="hidden md:flex text-red-600 hover:text-red-800 font-bold items-center gap-1 transition-colors uppercase text-sm tracking-wider">
            Ver todo el catálogo <ArrowRight size={18} />
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">Aún no hay sneakers destacados.</p>
            <p className="text-sm text-slate-400 mt-2">Agrega tus primeros pares desde el panel de administrador.</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/catalogo" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-sm hover:bg-slate-800 font-bold uppercase tracking-wider w-full">
            Ver todo el catálogo <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};