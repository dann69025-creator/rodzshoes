import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatCurrency';
import { ShoppingCart, ArrowLeft, Ruler, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de compra y vistas de imagen
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const availableSizes = ['37 EUR', '38 EUR', '39 EUR', '40 EUR', '41 EUR', '42 EUR', '43 EUR', '44 EUR', '45 EUR'];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        toast.error("Error al cargar el sneaker");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ESTA ES LA FUNCIÓN ARREGLADA QUE GUARDA EL PRODUCTO REALMENTE
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor selecciona una talla");
      return;
    }

    if (!product) return;

    // 1. Obtenemos el carrito actual del navegador (o un array vacío)
    const existingCart = JSON.parse(localStorage.getItem('rodz_cart') || '[]');

    // 2. Creamos el ítem del carrito
    const cartItem = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      talla: selectedSize, 
      cantidad: 1
    };

    // 3. Verificamos si el mismo producto con la misma talla ya está en el carrito
    const itemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id && item.talla === selectedSize
    );

    if (itemIndex > -1) {
      existingCart[itemIndex].cantidad += 1;
    } else {
      existingCart.push(cartItem);
    }

    // 4. Guardamos en localStorage
    localStorage.setItem('rodz_cart', JSON.stringify(existingCart));

    // 5. Notificamos éxito y avisamos al navegador para que actualice el icono
    toast.success(`¡Agregado al carrito! Talla: ${selectedSize}`);
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-black uppercase text-slate-900 mb-2">Sneaker no encontrado</h2>
        <p className="text-slate-500 mb-6">El par que buscas ya no está disponible.</p>
        <Link to="/catalogo" className="bg-red-600 text-white px-6 py-3 font-bold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  // Obtenemos el arreglo de imágenes (si tiene un array de 3 vistas lo usa, de lo contrario usa la imagen única)
  const productImages = product.imagenes && product.imagenes.length > 0 
    ? product.imagenes.filter(img => img && img.trim() !== '') 
    : [product.imagen];

  const activeImage = productImages[currentImageIndex] || product.imagen;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold uppercase text-sm tracking-wider mb-8 transition-colors">
        <ArrowLeft size={18} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* GALERÍA DE 3 VISTAS */}
        <div className="space-y-4">
          {/* Imagen Grande Activa */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex items-center justify-center relative overflow-hidden group">
            <img 
              src={activeImage} 
              alt={product.nombre} 
              className="w-full h-[380px] md:h-[480px] object-contain drop-shadow-xl transition-all duration-300" 
            />
            {product.precioAnterior && product.precioAnterior > product.precio && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
                Oferta
              </span>
            )}
          </div>

          {/* Miniaturas de las 3 Vistas */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {productImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 rounded-sm p-2 bg-slate-50 h-24 flex items-center justify-center transition-all ${
                    currentImageIndex === index ? 'border-red-600 ring-2 ring-red-600/20 scale-[1.02]' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={imgUrl} alt={`Vista ${index + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información y Compra */}
        <div className="space-y-6">
          <div>
            <p className="text-red-600 font-black uppercase tracking-widest text-sm mb-1">{product.marca || 'RodzShoes Exclusive'}</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">{product.nombre}</h1>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-black font-mono text-slate-900">{formatCurrency(product.precio)}</span>
            {product.precioAnterior && product.precioAnterior > product.precio && (
              <span className="text-lg font-mono text-slate-400 line-through">{formatCurrency(product.precioAnterior)}</span>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed font-medium">{product.descripcion}</p>

          {/* Selector de Tallas (EUR) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Selecciona tu Talla (EUR)</label>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors underline"
              >
                <Ruler size={14} /> Guía de Tallas (COL / CM / EUR)
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-2 border font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center justify-center ${
                    selectedSize === size 
                      ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
                      : 'bg-white text-slate-900 border-slate-200 hover:border-red-600 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> Selecciona una talla europea para continuar
              </p>
            )}
          </div>

          {product.especificaciones && (
            <div className="bg-slate-50 p-4 rounded-sm border border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">Colorway & Materiales</h4>
              <p className="text-sm text-slate-600 font-medium">{product.especificaciones}</p>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {product.stock > 0 ? `¡En Stock! (${product.stock} pares disponibles)` : 'Agotado'}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              <ShoppingCart size={20} /> Añadir al Carrito
            </button>
          </div>
        </div>
      </div>

      {/* MODAL GUÍA DE TALLAS */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-red-600">
            <div className="flex justify-between items-center px-5 py-4 bg-slate-900 text-white">
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <Ruler size={18} className="text-red-600" /> Guía de Tallas RodzShoes
              </h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <p className="text-xs text-slate-600 font-medium">
                Equivalencia rápida entre tu talla nacional (COL), centímetros y la talla europea (EUR):
              </p>

              <div className="border border-slate-200 rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">COL</th>
                      <th className="px-3 py-2">CM</th>
                      <th className="px-3 py-2 text-red-600">EUR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-900">
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">35</td><td className="px-3 py-1.5">23.0</td><td className="px-3 py-1.5 font-bold text-red-600">37 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">36</td><td className="px-3 py-1.5">23.5</td><td className="px-3 py-1.5 font-bold text-red-600">38 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">37</td><td className="px-3 py-1.5">24.5</td><td className="px-3 py-1.5 font-bold text-red-600">39 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">38</td><td className="px-3 py-1.5">25.0</td><td className="px-3 py-1.5 font-bold text-red-600">40 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">39</td><td className="px-3 py-1.5">26.0</td><td className="px-3 py-1.5 font-bold text-red-600">41 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">40</td><td className="px-3 py-1.5">26.5</td><td className="px-3 py-1.5 font-bold text-red-600">42 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">41</td><td className="px-3 py-1.5">27.5</td><td className="px-3 py-1.5 font-bold text-red-600">43 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">42</td><td className="px-3 py-1.5">28.0</td><td className="px-3 py-1.5 font-bold text-red-600">44 EUR</td></tr>
                    <tr className="hover:bg-slate-50"><td className="px-3 py-1.5 font-bold">43</td><td className="px-3 py-1.5">29.0</td><td className="px-3 py-1.5 font-bold text-red-600">45 EUR</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <X size={16} /> Cerrar Guía
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};