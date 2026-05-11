import { RegisterVisual } from '@/components/auth/RegisterVisual';
import { RegisterForm } from '@/components/auth/RegisterForm';

/**
 * Premium RegisterPage with split layout.
 */
export function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-[#030712] selection:bg-primary/30">
      {/* Lateral Izquierdo: Visual Inmersivo */}
      <RegisterVisual />
      
      {/* Lateral Derecho: Formulario de Registro */}
      <RegisterForm />
    </div>
  );
}

