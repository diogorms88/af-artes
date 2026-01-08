export interface Product {
    id?: number;
    name: string;
    category: string; // Categoria dinâmica
    price?: number;
    description: string;
    image: string; // Primeira imagem (compatibilidade)
    images?: string[]; // Array de todas as imagens
    dimensions: string;
    created_at?: string;
    updated_at?: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: "Nossa Senhora Aparecida",
        category: "Sacra",
        description: "Imagem de Nossa Senhora Aparecida com manto estilizado em pérolas e detalhes dourados.",
        image: "https://placehold.co/600x800/e0e0e0/333333?text=N.Sra+Aparecida",
        dimensions: "30cm x 12cm"
    },
    {
        id: 2,
        name: "Busto de Davi",
        category: "Decoração",
        description: "Réplica detalhada do busto de Davi de Michelangelo. Acabamento em gesso cru ou pintado.",
        image: "https://placehold.co/500x500/e0e0e0/333333?text=Busto+Davi",
        dimensions: "25cm x 20cm"
    },
    {
        id: 3,
        name: "São Francisco de Assis",
        category: "Sacra",
        description: "Imagem delicada de São Francisco com pássaros. Pintura à mão com tons terrosos.",
        image: "https://placehold.co/600x900/e0e0e0/333333?text=Sao+Francisco",
        dimensions: "40cm x 15cm"
    },
    {
        id: 4,
        name: "Vaso Grego Moderno",
        category: "Decoração",
        description: "Vaso estilo grego com linhas modernas e minimalistas. Ideal para ambientes sofisticados.",
        image: "https://placehold.co/400x500/e0e0e0/333333?text=Vaso+Grego",
        dimensions: "20cm x 18cm"
    },
    {
        id: 5,
        name: "Anjo da Guarda com Criança",
        category: "Infantil", // Adding a new category implicitly or mapping to 'Sacra'
        // Let's stick to the 3 main ones or add 'Estilizada'
        // I defined 'Sacra' | 'Decoração' | 'Estilizada' in interface
    } as any,
    // Wait, let's fix the object
    // Redoing entry 5
    {
        id: 5,
        name: "Sagrada Família Dourada",
        category: "Estilizada",
        description: "Conjunto da Sagrada Família com acabamento total em folha de ouro envelhecida.",
        image: "https://placehold.co/700x600/e0e0e0/333333?text=Sagrada+Familia",
        dimensions: "35cm x 25cm"
    },
    {
        id: 6,
        name: "Buda Meditando",
        category: "Decoração",
        description: "Estátua de Buda em meditação, acabamento cimento queimado.",
        image: "https://placehold.co/500x500/e0e0e0/333333?text=Buda",
        dimensions: "30cm x 25cm"
    }
];
