import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { AuthInput } from './AuthInput';
import { AuthBrand } from './AuthBrand';
import { AuthSocial } from './AuthSocial';
import { AuthSuccess } from './AuthSuccess';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
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
    <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 py-12">
      <div className="mx-auto w-full max-w-md">


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic lg:text-5xl">Crea tu cuenta.</h1>
          <p className="text-zinc-300 font-bold mb-10">Comienza a rastrear tu posicionamiento hoy.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive font-black border border-destructive/20"
              >
                {error}
              </motion.div>
            )}

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-lg shadow-xl shadow-primary/20 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Registrarme Gratis'}
            </Button>
          </form>

          <AuthSocial 
            text="O regístrate con" 
            onGoogleClick={signInWithGoogle} 
          />

          <p className="mt-10 text-center text-sm font-bold text-zinc-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline font-black">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

