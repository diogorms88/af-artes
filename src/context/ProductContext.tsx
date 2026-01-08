
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';
import * as productService from '../lib/productService';

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProduct: (id: number) => Product | undefined;
    refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar produtos do Supabase na inicialização
    const refreshProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            setError('Falha ao carregar produtos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    const addProduct = async (newProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            setError(null);
            const created = await productService.createProduct(newProduct);
            setProducts(prev => [created, ...prev]);
        } catch (err) {
            console.error('Erro ao adicionar produto:', err);
            setError('Falha ao adicionar produto.');
            throw err;
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            setError(null);
            if (!updatedProduct.id) {
                throw new Error('ID do produto é obrigatório para atualização');
            }
            const updated = await productService.updateProduct(updatedProduct.id, updatedProduct);
            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
            setError('Falha ao atualizar produto.');
            throw err;
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            setError(null);
            const product = products.find(p => p.id === id);
            await productService.deleteProduct(id, product?.image);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erro ao deletar produto:', err);
            setError('Falha ao deletar produto.');
            throw err;
        }
    };

    const getProduct = (id: number) => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            addProduct,
            updateProduct,
            deleteProduct,
            getProduct,
            refreshProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
