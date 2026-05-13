import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { Logo } from '../shared/Logo';
import { cn } from '@/lib/utils';

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavbarLink({ href, children }: NavbarLinkProps) {
  return (
    <a 
      href={href} 
      className="text-zinc-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

function NavbarActions() {
  const { user } = useAuth();

  if (user) {
    return (
      <Link to="/dashboard">
        <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-md px-5 transition-all active:scale-95">
          Panel de Control
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <Link to="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200">
        Entrar
      </Link>
      <Link to="/register">
        <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-md px-5 transition-all active:scale-95">
          Comenzar Gratis
        </Button>
      </Link>
    </div>
  );
}

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo textClassName="text-xl font-bold" />
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <NavbarLink href="#features">Funciones</NavbarLink>
          <NavbarLink href="#pricing">Precios</NavbarLink>
          <NavbarLink href="#faq">Preguntas</NavbarLink>
        </div>

        <NavbarActions />
      </div>
    </nav>
  );
}
