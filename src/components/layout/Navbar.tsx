import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const isHome = location.pathname === '/';

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-white/80 backdrop-blur-md py-6' : 'bg-white shadow-sm py-4'}`}
            style={{ color: 'var(--color-text)' }}
        >
            <div className="container flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    A&F Artes
                </Link>

                <div className="hidden md:flex gap-8 font-medium text-sm uppercase tracking-widest">
                    <Link to="/" className="hover:text-accent transition-colors" style={{ '--color-accent': 'var(--color-accent)' } as any}>Início</Link>
                    <Link to="/catalogo" className="hover:text-accent transition-colors">Catálogo</Link>
                    <button
                        onClick={() => {
                            if (location.pathname !== '/') {
                                navigate('/');
                                setTimeout(() => {
                                    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            } else {
                                document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="hover:text-accent transition-colors uppercase"
                    >
                        Contato
                    </button>
                    {user && (
                        <Link to="/admin" className="hover:text-accent transition-colors text-accent font-bold">Admin</Link>
                    )}
                </div>

                <div className="flex gap-3">
                    <Link
                        to="/catalogo"
                        className="px-6 py-2 border border-current rounded-none hover:bg-black hover:text-white transition-colors text-sm uppercase hidden md:block"
                    >
                        Loja
                    </Link>

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="p-2 md:px-6 md:py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors text-sm uppercase flex items-center gap-2"
                            title="Sair"
                        >
                            <LogOut size={16} />
                            <span className="hidden md:inline">Sair</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="p-2 md:px-6 md:py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors text-sm uppercase flex items-center gap-2"
                            title="Login"
                        >
                            <LogIn size={16} />
                            <span className="hidden md:inline">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
