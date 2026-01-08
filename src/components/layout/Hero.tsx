import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImage from '../../assets/images/hero_bg.png';

const Hero = () => {

    return (
        <section className="relative h-screen flex items-center overflow-hidden">
            {/* Background Image Wrapper */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Darker overlay */}
                <img
                    src={heroImage}
                    alt="Escultura em Gesso"
                    className="w-full h-full object-cover object-[center_15%]"
                />
            </div>

            <div className="container relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-left max-w-2xl text-white"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="block text-accent uppercase tracking-widest text-sm mb-4 font-bold"
                        style={{ color: '#FFD700' }}
                    >
                        Arte Sacra & Decoração
                    </motion.span>
                    <h1 className="text-5xl md:text-7xl mb-6 leading-tight text-white">
                        Transformamos <br />
                        <span className="italic font-serif text-accent" style={{ color: '#FFD700' }}>Gesso</span> em Arte
                    </h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-md text-gray-200">
                        Criação, reforma e estilização de imagens com acabamento premium.
                        Enviamos para todo o Brasil.
                    </p>

                    <div className="flex gap-4">
                        <a
                            href="/catalogo"
                            className="px-8 py-4 bg-white text-black flex items-center gap-2 transition hover:bg-gray-200"
                        >
                            Ver Coleção <ArrowRight size={20} />
                        </a>
                        <a
                            href="#contato"
                            className="px-8 py-4 border border-white text-white transition hover:bg-white hover:text-black"
                        >
                            Encomendar
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
