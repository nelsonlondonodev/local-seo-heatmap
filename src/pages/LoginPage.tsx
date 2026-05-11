import { useLocation } from 'react-router-dom';
import { LoginVisual } from '@/components/auth/LoginVisual';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthBrand } from '@/components/auth/AuthBrand';

export function LoginPage() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  return (
    <div className="flex min-h-screen bg-[#030712] selection:bg-primary/30 relative">
      <div className="absolute top-8 left-8 z-50">
        <AuthBrand />
      </div>

      {/* Lateral Izquierdo: Visual Inmersivo */}
      <LoginVisual />
      
      {/* Lateral Derecho: Formulario de Acceso */}
      <LoginForm from={from} />
    </div>
  );
}

