import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { fetchCategories, createCategory, deleteCategory } from '../../lib/categoryService';
import type { Category } from '../../lib/categoryService';

const CategoryManager = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const cats = await fetchCategories();
            setCategories(cats);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newCategory.trim()) return;

        try {
            setAdding(true);
            setError('');
            await createCategory(newCategory.trim());
            setNewCategory('');
            await loadCategories();
        } catch (err: any) {
            setError(err.message || 'Erro ao adicionar categoria');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Tem certeza que deseja deletar a categoria "${name}"?`)) return;

        try {
            await deleteCategory(id);
            await loadCategories();
        } catch (err: any) {
            alert(err.message || 'Erro ao deletar categoria');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Gerenciar Categorias</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Adicionar nova categoria */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Nova categoria..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                    disabled={adding}
                />
                <button
                    onClick={handleAdd}
                    disabled={adding || !newCategory.trim()}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {adding ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Adicionando...
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            Adicionar
                        </>
                    )}
                </button>
            </div>

            {/* Lista de categorias */}
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin mr-2" size={24} />
                    <span>Carregando...</span>
                </div>
            ) : (
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium">{cat.name}</span>
                            <button
                                onClick={() => handleDelete(cat.id!, cat.name)}
                                className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded"
                                title="Deletar categoria"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Nenhuma categoria cadastrada</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
