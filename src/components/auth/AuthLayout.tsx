import type { ReactNode } from 'react';
import { AuthBrand } from './AuthBrand';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#030712] selection:bg-primary/30 relative overflow-x-hidden">
      {/* Persistent Logo */}
      <div className="absolute top-8 left-8 z-50">
        <AuthBrand />
      </div>

      {children}
    </div>
  );
}
