import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '../types';
import { getActiveBanners } from '../services/bannerService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { LoadingSpinner } from './LoadingSpinner';

export const PromotionCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const activeBanners = await getActiveBanners();
      // Filtrar por fechas si es necesario
      const now = new Date();
      const validBanners = activeBanners.filter(b => {
        if (b.fechaInicio && b.fechaInicio.toDate() > now) return false;
        if (b.fechaFin && b.fechaFin.toDate() < now) return false;
        return true;
      });
      setBanners(validBanners);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  if (loading) return <div className="h-[60vh] bg-slate-50 flex items-center justify-center"><LoadingSpinner /></div>;
  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden group bg-primary">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          <img
            src={banner.imagen}
            alt={banner.titulo}
            className="w-full h-full object-cover object-center"
          />
          
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
            <div className="max-w-3xl space-y-6 transform transition-all duration-700 translate-y-0">
              {banner.subtitulo && (
                <p className="text-accent font-semibold tracking-[0.2em] uppercase text-sm md:text-base">
                  {banner.subtitulo}
                </p>
              )}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight drop-shadow-md">
                {banner.titulo}
              </h2>
              {banner.descripcion && (
                <p className="text-slate-200 text-lg md:text-xl font-light max-w-2xl mx-auto drop-shadow">
                  {banner.descripcion}
                </p>
              )}
              
              {(banner.precioNuevo || banner.descuento) && (
                <div className="flex items-center justify-center gap-4 text-white my-6">
                  {banner.precioAnterior && (
                    <span className="text-xl line-through text-slate-300">
                      {formatCurrency(banner.precioAnterior)}
                    </span>
                  )}
                  {banner.precioNuevo && (
                    <span className="text-3xl font-bold text-accent">
                      {formatCurrency(banner.precioNuevo)}
                    </span>
                  )}
                </div>
              )}
              
              <div className="pt-4">
                <Link to={banner.link} className="inline-block bg-white text-primary px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 shadow-lg">
                  {banner.botonTexto}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={32} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={32} />
          </button>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-accent scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};