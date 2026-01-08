import { supabase, STORAGE_BUCKET } from './supabase';
import type { Product } from '../data/products';

/**
 * Upload de imagem para o Supabase Storage
 * @param file - Arquivo de imagem
 * @param productName - Nome do produto (usado para nomear o arquivo)
 * @returns URL pública da imagem
 */
export async function uploadProductImage(file: File, productName: string): Promise<string> {
    try {
        // Gerar nome único para o arquivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${productName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload do arquivo
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            throw uploadError;
        }

        // Obter URL pública
        const { data } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw new Error('Falha ao fazer upload da imagem');
    }
}

/**
 * Deletar imagem do Supabase Storage
 * @param imageUrl - URL da imagem a ser deletada
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
    try {
        // Extrair o caminho do arquivo da URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(pathParts.indexOf('products')).join('/');

        if (!filePath.startsWith('products/')) {
            // Não é uma imagem do storage, ignorar
            return;
        }

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

        if (error) {
            console.error('Erro ao deletar imagem:', error);
        }
    } catch (error) {
        console.error('Erro ao processar deleção de imagem:', error);
    }
}

/**
 * Buscar todos os produtos
 */
export async function fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }

    return data || [];
}

/**
 * Buscar produto por ID
 */
export async function fetchProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Erro ao buscar produto:', error);
        return null;
    }

    return data;
}

/**
 * Criar novo produto
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }

    return data;
}

/**
 * Atualizar produto existente
 */
export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }

    return data;
}

/**
 * Deletar produto
 */
export async function deleteProduct(id: number, imageUrl?: string): Promise<void> {
    // Deletar imagem se existir
    if (imageUrl) {
        await deleteProductImage(imageUrl);
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
}
