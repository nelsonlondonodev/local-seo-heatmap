import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { AuthInput } from './AuthInput';
import { AuthSocial } from './AuthSocial';
import { AuthSuccess } from './AuthSuccess';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

export function RegisterForm() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      setIsEmailSent(true);
      toast.info('Revisa tu correo para confirmar tu cuenta');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
      toast.error('Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthSuccess 
        email={email}
        title="¡Casi listo!"
        description="Hemos enviado un link a"
        buttonText="Volver al inicio de sesión"
        buttonLink="/login"
      />
    );
  }

  return (
    <div className="flex w-full flex-col justify-center px-6 lg:px-12 lg:w-1/2 py-12 bg-zinc-950">
      <div className="mx-auto w-full max-w-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-3">
            Crea tu cuenta
          </h1>
          <p className="text-zinc-500 font-medium mb-10 text-sm">
            Comienza a rastrear tu posicionamiento hoy mismo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-500/5 p-3 text-xs font-semibold text-red-400 border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <AuthInput
                id="fullName"
                label="Nombre completo"
                type="text"
                placeholder="Juan García"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={User}
                autoComplete="name"
              />

              <AuthInput
                id="email"
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                autoComplete="email"
              />

              <AuthInput
                id="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-600 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full h-12 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-bold text-sm mt-4",
                "active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              )}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrarme Gratis'}
            </Button>
          </form>

          <AuthSocial 
            text="O regístrate con" 
            onGoogleClick={signInWithGoogle} 
          />

          <p className="mt-10 text-center text-xs font-medium text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white hover:underline font-bold transition-all">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

