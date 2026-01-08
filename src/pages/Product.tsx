import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchSettings } from '../lib/settingsService';
import type { SiteSettings } from '../lib/settingsService';

const Product = () => {
    const { id } = useParams();
    const { getProduct } = useProducts();
    const product = getProduct(Number(id));
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    // Estado para controlar qual imagem está sendo exibida
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await fetchSettings();
            setSettings(data);
        };
        loadSettings();
    }, []);

    if (!product) {
        return (
            <div className="section container text-center py-20">
                <h2 className="text-2xl mb-4">Produto não encontrado</h2>
                <Link to="/catalogo" className="underline">Voltar para o catálogo</Link>
            </div>
        );
    }

    // Usar array de imagens ou fallback para imagem única
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const currentImage = images[selectedImageIndex];

    const whatsappNumber = settings?.whatsapp_number || '5511000000000';
    const whatsappMessage = encodeURIComponent(`Olá, gostaria de saber mais sobre a peça: ${product.name}`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section container min-h-screen pt-36"
        >
            <Link to="/catalogo" className="inline-flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft size={16} /> Voltar para o Catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Galeria de Imagens */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-3"
                >
                    {/* Imagem Principal - Reduzida */}
                    <div className="bg-gray-100 aspect-square overflow-hidden rounded-lg max-w-md mx-auto">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thumbnails - Scroll horizontal */}
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 max-w-md mx-auto">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border-2 transition-all ${selectedImageIndex === index
                                        ? 'border-black ring-2 ring-black'
                                        : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-sm uppercase tracking-widest text-accent font-bold mb-2 block" style={{ color: 'var(--color-accent)' }}>
                        {product.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl mb-6 leading-tight font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                        {product.name}
                    </h1>

                    <div className="space-y-6 mb-10 opacity-80 text-lg leading-relaxed">
                        <p>{product.description}</p>
                        <p><strong>Dimensões:</strong> {product.dimensions}</p>
                    </div>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto px-8 py-4 bg-green-600 text-white flex items-center justify-center gap-3 hover:bg-green-700 transition-colors text-lg"
                    >
                        <MessageCircle size={24} />
                        Solicitar Orçamento
                    </a>
                    <p className="mt-4 text-xs opacity-50 text-center md:text-left">
                        Você será redirecionado para o WhatsApp para falar diretamente com o ateliê.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Product;
