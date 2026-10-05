import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getActiveProducts } from '../services/productService';
import { ProductCard } from '../components/ProductCard'; 
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Product } from '../types';
import { Search, Filter, X } from 'lucide-react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGender = searchParams.get('genero') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getActiveProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Sincronizar filtro inicial de URL si cambia
  useEffect(() => {
    const gen = searchParams.get('genero');
    if (gen) setSelectedGender(gen);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchName = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchGender = selectedGender ? p.genero === selectedGender : true;
      return matchName && matchGender;
    });
  }, [products, searchTerm, selectedGender]);

  const updateGenderFilter = (gender: string) => {
    setSelectedGender(gender);
    if (gender) {
      setSearchParams({ genero: gender });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Catálogo de sneakers</h1>
          <p className="text-slate-500 mt-2">Descubre nuestra colección exclusiva</p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 text-primary font-medium border border-slate-200 px-4 py-2 rounded-md"
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
          {showFilters ? 'Ocultar Filtros' : 'Filtros'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filtros */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-8`}>
          {/* Buscador */}
          <div>
            <h3 className="font-medium text-primary mb-3 uppercase tracking-wider text-sm">Buscar</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            </div>
          </div>

          {/* Filtro por Género */}
          <div>
            <h3 className="font-medium text-primary mb-3 uppercase tracking-wider text-sm">Género</h3>
            <div className="space-y-2">
              {['', 'Hombre', 'Mujer', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => updateGenderFilter(g)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedGender === g 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g === '' ? 'Todos' : g}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid de Productos */}
        <main className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 text-lg">No se encontraron productos con estos filtros.</p>
              <button 
                onClick={() => { setSearchTerm(''); updateGenderFilter(''); }}
                className="mt-4 text-accent font-medium hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};