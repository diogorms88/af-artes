
import { useState, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../data/products';
import { Trash2, Edit, Plus, Image as ImageIcon, X, Check, Loader2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadProductImage } from '../lib/productService';
import { fetchCategories } from '../lib/categoryService';
import CategoryManager from '../components/admin/CategoryManager';
import SettingsManager from '../components/admin/SettingsManager';

const Admin = () => {
    const { products, addProduct, updateProduct, deleteProduct, loading, error } = useProducts();
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [showSettingsManager, setShowSettingsManager] = useState(false);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carregar categorias
    const loadCategories = async () => {
        try {
            const cats = await fetchCategories();
            setCategories(cats.map(c => c.name));
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentProduct({
            name: '',
            category: 'Sacra',
            description: '',
            image: '',
            dimensions: ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        if (window.confirm('Tem certeza que deseja remover este produto?')) {
            try {
                await deleteProduct(id);
            } catch (err) {
                alert('Erro ao deletar produto. Tente novamente.');
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProduct.name || !currentProduct.description || !currentProduct.image) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            setSaving(true);
            if (currentProduct.id) {
                await updateProduct(currentProduct as Product);
            } else {
                await addProduct(currentProduct as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
            }
            setIsEditing(false);
            setCurrentProduct({});
        } catch (err) {
            alert('Erro ao salvar produto. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const productName = currentProduct.name || 'produto';
            const uploadedUrls: string[] = [];

            // Upload de todas as imagens selecionadas
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > 10 * 1024 * 1024) {
                    alert(`Imagem ${file.name} muito grande (max 10MB)`);
                    continue;
                }
                const imageUrl = await uploadProductImage(file, productName);
                uploadedUrls.push(imageUrl);
            }

            // Adicionar às imagens existentes
            const currentImages = currentProduct.images || [];
            const allImages = [...currentImages, ...uploadedUrls];

            setCurrentProduct({
                ...currentProduct,
                images: allImages,
                image: allImages[0] // Primeira imagem como principal
            });
        } catch (err) {
            console.error('Erro ao fazer upload:', err);
            alert('Erro ao fazer upload das imagens. Tente novamente.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const images = currentProduct.images || [];
        const newImages = images.filter((_, i) => i !== index);
        setCurrentProduct({
            ...currentProduct,
            images: newImages,
            image: newImages[0] || ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-36 pb-20 px-4">
            <div className="container max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 text-center md:text-left">Painel Administrativo</h1>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowSettingsManager(true)}
                            className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition w-full sm:w-auto"
                            title="Configurações do Site"
                        >
                            <Settings size={20} />
                            <span className="sm:hidden">Configurações</span>
                        </button>
                        <button
                            onClick={() => setShowCategoryManager(!showCategoryManager)}
                            className="bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto"
                        >
                            <Plus size={20} /> Categorias
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto"
                        >
                            <Plus size={20} /> Produto
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin mr-3" size={32} />
                        <span className="text-lg text-gray-600">Carregando produtos...</span>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-6 font-semibold text-gray-600 w-20">Imagem</th>
                                            <th className="p-6 font-semibold text-gray-600">Nome</th>
                                            <th className="p-6 font-semibold text-gray-600">Categoria</th>
                                            <th className="p-6 font-semibold text-gray-600 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50/50 transition">
                                                <td className="p-4 pl-6">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=No+Img' }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-6 font-medium text-gray-900">{product.name}</td>
                                                <td className="p-6 text-gray-500">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="Editar"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {products.length === 0 && (
                                <div className="p-12 text-center text-gray-400">
                                    Nenhum produto cadastrado.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modal de Edição */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white md:rounded-2xl w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-2xl font-serif">
                                    {currentProduct.id ? 'Editar Produto' : 'Novo Produto'}
                                </h2>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Nome do Produto</label>
                                        <input
                                            type="text"
                                            value={currentProduct.name || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                                            placeholder="Ex: Imagem de São José"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Categoria</label>
                                        <select
                                            value={currentProduct.category || categories[0] || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition bg-white"
                                            required
                                        >
                                            {categories.length === 0 ? (
                                                <option value="">Carregando...</option>
                                            ) : (
                                                categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Descrição</label>
                                    <textarea
                                        value={currentProduct.description || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition min-h-[100px]"
                                        placeholder="Descreva os detalhes da peça..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Dimensões</label>
                                        <input
                                            type="text"
                                            value={currentProduct.dimensions || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, dimensions: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                                            placeholder="Ex: 30cm x 15cm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Preço (Opcional)</label>
                                        <input
                                            type="number"
                                            value={currentProduct.price || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                                            placeholder="Ex: 150.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500 block">Imagens do Produto</label>

                                    {/* Galeria de imagens */}
                                    {currentProduct.images && currentProduct.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            {currentProduct.images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`Imagem ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remover imagem"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    {index === 0 && (
                                                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                            Principal
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload de novas imagens */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Adicionar imagens (Max 10MB cada)</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                multiple
                                                disabled={uploading}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-black file:text-white
                                                    hover:file:bg-gray-800
                                                    cursor-pointer
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            {uploading && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Loader2 className="animate-spin text-blue-600" size={16} />
                                                    <p className="text-xs text-blue-600">Fazendo upload das imagens...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={saving || uploading}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={20} /> Salvar Produto
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Categorias */}
            <AnimatePresence>
                {showCategoryManager && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCategoryManager(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white md:rounded-2xl w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-2xl font-serif">Gerenciar Categorias</h2>
                                <button
                                    onClick={() => setShowCategoryManager(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8">
                                <CategoryManager />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Configurações */}
            <AnimatePresence>
                {showSettingsManager && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowSettingsManager(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white md:rounded-2xl w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-2xl font-serif">Configurações do Site</h2>
                                <button
                                    onClick={() => setShowSettingsManager(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8">
                                <SettingsManager />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
