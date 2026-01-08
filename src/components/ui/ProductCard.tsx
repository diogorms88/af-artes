import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../data/products';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative bg-white block overflow-hidden mb-8 break-inside-avoid"
        // break-inside-avoid is for masonry column support
        >
            <Link to={`/produto/${product.id}`} className="block">
                <div className="relative overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ minHeight: '300px' }} // Fallback height
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-6 py-2 bg-white text-black text-sm uppercase tracking-widest font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            Ver Detalhes
                        </span>
                    </div>
                </div>
                <div className="p-4 text-center">
                    <h3 className="text-lg font-serif mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{product.name}</h3>
                    <span className="text-xs uppercase tracking-widest text-gray-500">{product.category}</span>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
