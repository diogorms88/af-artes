import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { fetchCategories } from '../lib/categoryService';

const Catalog = () => {
    const { products, loading } = useProducts();
    const [filter, setFilter] = useState('Todos');
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Buscar categorias do Supabase
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await fetchCategories();
                setCategories(['Todos', ...cats.map(c => c.name)]);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                setCategories(['Todos']); // Fallback
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    const filteredProducts = filter === 'Todos'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <div className="section container min-h-screen">
            <div className="text-center mb-16 pt-36">
                <h1 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Nossa Coleção</h1>

                {loadingCategories ? (
                    <div className="flex justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm text-gray-600">Carregando categorias...</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full border transition-all text-sm uppercase tracking-widest ${filter === cat
                                    ? 'bg-black text-white border-black'
                                    : 'bg-transparent text-gray-600 border-gray-300 hover:border-black'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin mr-3" size={32} />
                    <span className="text-lg text-gray-600">Carregando produtos...</span>
                </div>
            ) : (
                <>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                        >
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <p>Nenhum produto encontrado nesta categoria.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Catalog;
