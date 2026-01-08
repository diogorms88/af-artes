import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Instagram } from 'lucide-react';
import { fetchSettings } from '../../lib/settingsService';
import type { SiteSettings } from '../../lib/settingsService';

const Contact = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await fetchSettings();
            setSettings(data);
        };
        loadSettings();
    }, []);

    // Defaults
    const whatsappNumber = settings?.whatsapp_number || '5511000000000';
    const whatsappMessage = settings?.whatsapp_message || 'Olá! Gostaria de saber mais sobre as peças em gesso.';
    const shopeeLink = settings?.shopee_link || 'https://shopee.com.br/fabioasantos1407';
    const instagramLink = settings?.instagram_link || 'https://instagram.com/afartesemgesso';

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <section id="contato" className="section py-24 bg-white" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="container">
                <div className="bg-charcoal text-white rounded-2xl p-8 md:p-16 text-center relative overflow-hidden"
                    style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>

                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-5xl mb-6 font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                            Fale Conosco
                        </h2>
                        <p className="text-lg opacity-80 mb-12 leading-relaxed">
                            Quer encomendar uma peça personalizada, restaurar uma imagem antiga ou conhecer mais sobre nosso trabalho?
                            Entre em contato pelas nossas redes ou visite nossa loja na Shopee!
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            {/* WhatsApp */}
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-lg flex items-center justify-center gap-3 hover:bg-green-700 hover:scale-105 transition-all font-bold shadow-lg shadow-green-900/20"
                            >
                                <MessageCircle size={24} />
                                <span>WhatsApp</span>
                            </a>

                            {/* Shopee */}
                            <a
                                href={shopeeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-auto px-8 py-4 bg-[#EE4D2D] text-white rounded-lg flex items-center justify-center gap-3 hover:bg-[#d63d1e] hover:scale-105 transition-all font-bold shadow-lg shadow-orange-900/20"
                            >
                                <ShoppingBag size={24} />
                                <span>Loja Shopee</span>
                            </a>

                            {/* Instagram */}
                            <a
                                href={instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white rounded-lg flex items-center justify-center gap-3 hover:opacity-90 hover:scale-105 transition-all font-bold shadow-lg shadow-purple-900/20"
                            >
                                <Instagram size={24} />
                                <span>Instagram</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
