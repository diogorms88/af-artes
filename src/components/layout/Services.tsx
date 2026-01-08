import { motion } from 'framer-motion';
import { Hammer, Paintbrush, RefreshCw } from 'lucide-react';

const services = [
    {
        icon: <Hammer size={32} />,
        title: "Criação",
        description: "Peças exclusivas moldadas com perfeição para sua devoção ou decoração."
    },
    {
        icon: <RefreshCw size={32} />,
        title: "Reforma",
        description: "Restauramos a beleza original de suas imagens antigas com técnicas especializadas."
    },
    {
        icon: <Paintbrush size={32} />,
        title: "Estilização",
        description: "Personalização com pinturas finas e detalhes únicos."
    }
];

const Services = () => {
    return (
        <section className="section py-24 bg-white" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-accent uppercase tracking-widest text-sm font-bold" style={{ color: 'var(--color-accent)' }}>Nossos Serviços</span>
                    <h2 className="text-4xl mt-2" style={{ color: 'var(--color-text)' }}>O que fazemos</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 border border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                        >
                            <div className="mb-6 opacity-80" style={{ color: 'var(--color-accent)' }}>
                                {service.icon}
                            </div>
                            <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{service.title}</h3>
                            <p style={{ color: 'var(--color-secondary)' }}>{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
