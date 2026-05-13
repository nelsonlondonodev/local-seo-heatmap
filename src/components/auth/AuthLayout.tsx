import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AuthBrand } from './AuthBrand';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950 selection:bg-white/10 relative overflow-y-auto overflow-x-hidden">
      {/* Persistent Logo - Clickable to Home */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-50 hover:opacity-70 transition-opacity"
      >
        <AuthBrand />
      </Link>

      {children}
    </div>
  );
}
