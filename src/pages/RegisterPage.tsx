import { RegisterVisual } from '@/components/auth/RegisterVisual';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthBrand } from '@/components/auth/AuthBrand';

/**
 * Premium RegisterPage with split layout.
 */
export function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-[#030712] selection:bg-primary/30 relative">
      <div className="absolute top-8 left-8 z-50">
        <AuthBrand />
      </div>

      {/* Lateral Izquierdo: Visual Inmersivo */}
      <RegisterVisual />
      
      {/* Lateral Derecho: Formulario de Registro */}
      <RegisterForm />
    </div>
  );
}


