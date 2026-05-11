import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/features/branding';
import { useAuth } from '@/features/auth';
import { Logo } from '../shared/Logo';

export function Navbar() {
  const { config } = useBranding();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 glass-morphism">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo textClassName="text-gradient" />
        <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-400">
          <a href="#features" className="hover:text-primary transition-colors">Funciones</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:scale-105 transition-transform font-black rounded-xl px-8 shadow-lg shadow-primary/20">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-black hover:text-primary transition-colors">Entrar</Link>
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:scale-105 transition-transform font-black rounded-xl px-8 shadow-lg shadow-primary/20">
                  Comenzar Gratis
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
