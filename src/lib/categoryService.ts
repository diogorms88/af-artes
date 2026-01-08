import { supabase } from './supabase';

export interface Category {
    id?: number;
    name: string;
    created_at?: string;
}

/**
 * Buscar todas as categorias
 */
export async function fetchCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw new Error('Falha ao buscar categorias');
    }

    return data || [];
}

/**
 * Criar nova categoria
 */
export async function createCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar categoria:', error);
        throw new Error(error.message || 'Falha ao criar categoria');
    }

    return data;
}

/**
 * Deletar categoria
 */
export async function deleteCategory(id: number): Promise<void> {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao deletar categoria:', error);
        throw new Error(error.message || 'Falha ao deletar categoria');
    }
}
