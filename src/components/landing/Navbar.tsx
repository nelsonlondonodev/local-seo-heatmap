import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/features/branding';
import { useAuth } from '@/features/auth';
import { Logo } from '../shared/Logo';

export function Navbar() {
  useBranding();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo textClassName="text-xl font-bold" />
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Funciones</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-md px-5">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Entrar</Link>
              <Link to="/register">
                <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-md px-5">
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
