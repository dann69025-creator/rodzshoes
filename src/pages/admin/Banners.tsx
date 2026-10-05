import { useState, useEffect, FormEvent } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Edit2, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface Banner {
  id: string;
  titulo: string;
  subtitulo: string;
  imagen: string;
  link: string;
  activo: boolean;
}

const initialFormState: Omit<Banner, 'id'> = {
  titulo: '',
  subtitulo: '',
  imagen: '',
  link: '',
  activo: true
};

export const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(initialFormState);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'banners'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
      setBanners(data);
    } catch (error) {
      toast.error("Error al cargar los banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData(banner);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.imagen) {
        toast.error("Debes indicar la ruta de la imagen");
        setIsSubmitting(false);
        return;
      }

      if (editingId) {
        const docRef = doc(db, 'banners', editingId);
        await updateDoc(docRef, formData);
        toast.success("Banner actualizado");
      } else {
        const newDocRef = doc(collection(db, 'banners'));
        await setDoc(newDocRef, formData);
        toast.success("Banner creado");
      }

      handleCloseModal();
      fetchBanners();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este banner?')) {
      try {
        await deleteDoc(doc(db, 'banners', id));
        toast.success('Banner eliminado');
        fetchBanners();
      } catch (error) {
        toast.error('Error al eliminar el banner');
      }
    }
  };

  if (loading && banners.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Gestión de Banners</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Nuevo Banner
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Imagen</th>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Enlace</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.map(banner => (
                <tr key={banner.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <img src={banner.imagen} alt={banner.titulo} className="w-20 h-10 object-cover rounded bg-slate-100" />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{banner.titulo}</td>
                  <td className="px-6 py-4 text-slate-500">{banner.link}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      banner.activo ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {banner.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(banner)} className="text-primary hover:text-accent p-2 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-primary">
                {editingId ? 'Editar Banner' : 'Nuevo Banner'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <input required type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="input-field" placeholder="Ej: Colección Verano 2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtítulo</label>
                  <input type="text" value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} className="input-field" placeholder="Ej: Descubre las nuevas fragancias" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ruta de la Imagen Local</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="/images/banners/tu-banner.jpg"
                    value={formData.imagen} 
                    onChange={e => setFormData({...formData, imagen: e.target.value})} 
                    className="input-field" 
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Guarda la imagen en <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">public/images/banners/</code> y escribe su ruta aquí.
                  </p>
                </div>

                {formData.imagen ? (
                  <div className="relative w-full h-32 border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                    <img 
                      src={formData.imagen} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                    <ImageIcon size={40} className="mx-auto text-slate-400 mb-2" />
                    <span className="text-xs text-slate-400">Vista previa aparecerá al ingresar la ruta</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enlace del botón (Opcional)</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="input-field" placeholder="Ej: /catalogo" />
                </div>

                <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-slate-700">Banner Activo</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
                <button type="button" onClick={handleCloseModal} className="btn-outline">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[150px]">
                  {isSubmitting ? 'Guardando...' : 'Guardar Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};