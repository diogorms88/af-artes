const Footer = () => {
    return (
        <footer className="py-16 mt-20 text-white" style={{ backgroundColor: 'var(--color-text)' }}>
            <div className="container flex flex-col items-center text-center">
                <h3 className="text-3xl mb-6 font-serif" style={{ fontFamily: 'var(--font-heading)' }}>A&F Artes em Gesso</h3>
                <p className="opacity-70 leading-relaxed max-w-lg mx-auto text-lg">
                    Transformando gesso em arte sacra e decorativa.
                    Peças exclusivas feitas à mão com amor.
                </p>
            </div>

            <div className="container mt-16 pt-8 border-t border-white/10 text-center opacity-40 text-sm">
                &copy; {new Date().getFullYear()} A&F Artes em Gesso. Todos os direitos reservados.
            </div>
        </footer>
    );
};

export default Footer;
