import { useState, useEffect, FormEvent } from 'react';
import { getAllProductsAdmin } from '../../services/productService';
import { Product } from '../../types';
import { db } from '../../firebase/config';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Edit2, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const initialFormState: Omit<Product, 'id'> = {
  nombre: '',
  descripcion: '',
  precio: 0,
  precioAnterior: 0,
  imagen: '',
  imagenes: ['', '', ''], // 3 vistas por defecto
  categoria: '',
  marca: '',
  genero: '',
  ml: '',
  stock: 0,
  activo: true,
  destacado: false,
  especificaciones: ''
};

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProductsAdmin();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        ...product,
        // Si el producto antiguo solo tenía 'imagen', lo rellenamos en el array de 3 vistas
        imagenes: product.imagenes && product.imagenes.length === 3 
          ? product.imagenes 
          : [product.imagen || '', '', '']
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  // Manejar cambios en las 3 imágenes específicas
  const handleImageVectorChange = (index: number, value: string) => {
    const newImages = [...(formData.imagenes || ['', '', ''])];
    newImages[index] = value;
    
    setFormData({
      ...formData,
      imagenes: newImages,
      imagen: index === 0 ? value : formData.imagen // La primera vista es la principal por defecto
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.imagenes || !formData.imagenes[0]) {
        toast.error("Debes indicar al menos la primera imagen principal");
        setIsSubmitting(false);
        return;
      }

      // Asegurar que la imagen principal sea siempre la primera del array de 3 vistas
      const finalData = {
        ...formData,
        imagen: formData.imagenes[0]
      };

      if (editingId) {
        const docRef = doc(db, 'products', editingId);
        await updateDoc(docRef, finalData);
        toast.success("Sneaker actualizado");
      } else {
        const newDocRef = doc(collection(db, 'products'));
        await setDoc(newDocRef, finalData);
        toast.success("Sneaker agregado");
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el sneaker");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 border-b-2 border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Inventario <span className="text-red-600">Rodz</span></h1>
          <p className="text-slate-500 font-medium mt-1">Gestión de Sneakers (3 Vistas)</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-red-600 text-white px-5 py-2.5 rounded-sm hover:bg-red-700 flex items-center gap-2 font-bold uppercase tracking-wider text-sm transition-colors shadow-md"
        >
          <Plus size={20} /> Nuevo Par
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-white border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Imagen</th>
                <th className="px-6 py-4 font-bold">Modelo</th>
                <th className="px-6 py-4 font-bold">Precio</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={product.imagen} alt={product.nombre} className="w-16 h-16 object-cover rounded-sm bg-slate-100 border border-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 uppercase">{product.nombre}</p>
                    <p className="text-xs text-slate-500 font-medium">{product.marca} | {product.categoria}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(product.precio)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${product.stock <= 2 ? 'text-red-600' : 'text-slate-900'}`}>
                      {product.stock} prs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${
                      product.activo ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {product.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="text-slate-400 hover:text-red-600 p-2 transition-colors"
                      title="Editar Sneaker"
                    >
                      <Edit2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar con 3 Vistas */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl my-8 border-t-4 border-red-600">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {editingId ? 'Editar Sneaker' : 'Agregar Nuevo Par'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-red-600 transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda: Datos generales */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Nombre del Modelo</label>
                    <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" placeholder="Ej: Air Jordan 1 Retro High" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Marca</label>
                      <input type="text" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" placeholder="Ej: Nike, Adidas..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Categoría</label>
                      <select value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all bg-white">
                        <option value="">Seleccionar...</option>
                        <option value="Men">Men (Hombre)</option>
                        <option value="Women">Women (Mujer)</option>
                        <option value="Kids">Kids (Niños)</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Precio (COP)</label>
                      <input required type="number" min="0" value={formData.precio} onChange={e => setFormData({...formData, precio: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider text-slate-500">Precio Anterior</label>
                      <input type="number" min="0" value={formData.precioAnterior} onChange={e => setFormData({...formData, precioAnterior: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all font-mono" placeholder="Para ofertas" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Pares en Stock</label>
                      <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Talla (EUR)</label>
                      <input type="text" value={formData.ml} onChange={e => setFormData({...formData, ml: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" placeholder="Ej: 42 EUR" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Descripción del Par</label>
                    <textarea required rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>

                {/* Columna Derecha: Las 3 Vistas de Imágenes y Materiales */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b pb-1">3 Vistas del Sneaker</h3>
                  
                  {/* Vista 1 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">1. Vista Principal / Lateral (Requerida)</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="/images/products/vista1.jpg"
                      value={formData.imagenes?.[0] || ''} 
                      onChange={e => handleImageVectorChange(0, e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs font-mono" 
                    />
                  </div>

                  {/* Vista 2 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">2. Vista Frontal</label>
                    <input 
                      type="text" 
                      placeholder="/images/products/vista2.jpg"
                      value={formData.imagenes?.[1] || ''} 
                      onChange={e => handleImageVectorChange(1, e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs font-mono" 
                    />
                  </div>

                  {/* Vista 3 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">3. Vista Suela / Detalle</label>
                    <input 
                      type="text" 
                      placeholder="/images/products/vista3.jpg"
                      value={formData.imagenes?.[2] || ''} 
                      onChange={e => handleImageVectorChange(2, e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs font-mono" 
                    />
                  </div>

                  {/* Vista Previa de la principal */}
                  {formData.imagenes?.[0] ? (
                    <div className="relative w-full h-32 border border-slate-200 rounded-sm p-2 bg-slate-50 flex items-center justify-center">
                      <img 
                        src={formData.imagenes[0]} 
                        alt="Preview principal" 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-300 rounded-sm p-3 text-center bg-slate-50">
                      <ImageIcon size={28} className="mx-auto text-slate-300 mb-1" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Vista previa principal</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Materiales / Colorway</label>
                    <textarea rows={2} value={formData.especificaciones} onChange={e => setFormData({...formData, especificaciones: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs resize-none" placeholder="Ej: Cuero premium..."></textarea>
                  </div>
                  
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} className="w-4 h-4 text-red-600 accent-red-600" />
                      <span className="text-xs font-bold text-slate-700 uppercase">Activo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.destacado} onChange={e => setFormData({...formData, destacado: e.target.checked})} className="w-4 h-4 text-red-600 accent-red-600" />
                      <span className="text-xs font-bold text-slate-700 uppercase">Destacado</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4 border-t-2 border-slate-100 pt-6 bg-slate-50 -mx-8 -mb-8 p-8 rounded-b-sm">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-sm uppercase tracking-wider text-xs">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-red-600 text-white px-8 py-2.5 rounded-sm font-bold hover:bg-red-700 transition-colors shadow-lg disabled:opacity-70 uppercase tracking-wider text-xs">
                  {isSubmitting ? 'Guardando...' : 'Guardar Sneaker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};