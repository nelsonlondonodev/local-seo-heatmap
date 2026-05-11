import { useLocation } from 'react-router-dom';
import { LoginVisual } from '@/components/auth/LoginVisual';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/auth/AuthLayout';

export function LoginPage() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  return (
    <AuthLayout>
      {/* Lateral Izquierdo: Visual Inmersivo */}
      <LoginVisual />
      
      {/* Lateral Derecho: Formulario de Acceso */}
      <LoginForm from={from} />
    </AuthLayout>
  );
}


