import { RegisterVisual } from '@/components/auth/RegisterVisual';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/auth/AuthLayout';

/**
 * Premium RegisterPage with split layout.
 */
export function RegisterPage() {
  return (
    <AuthLayout>
      {/* Lateral Izquierdo: Visual Inmersivo */}
      <RegisterVisual />
      
      {/* Lateral Derecho: Formulario de Registro */}
      <RegisterForm />
    </AuthLayout>
  );
}



