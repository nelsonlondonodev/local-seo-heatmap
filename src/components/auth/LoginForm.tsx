import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { AuthInput } from './AuthInput';
import { AuthSocial } from './AuthSocial';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  from: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

export function LoginForm({ from }: LoginFormProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col justify-center px-6 lg:px-12 lg:w-1/2 bg-zinc-950">
      <div className="mx-auto w-full max-sm:max-w-sm max-w-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-3">
            Bienvenido
          </h1>
          <p className="text-zinc-500 font-medium mb-10 text-sm">
            Ingresa tus credenciales para acceder a tu panel.
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
                autoComplete="current-password"
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

            <div className="flex justify-end pr-1">
              <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full h-12 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-bold text-sm",
                "active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              )}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar al Panel'}
            </Button>
          </form>

          <AuthSocial 
            text="O continúa con" 
            onGoogleClick={signInWithGoogle} 
          />

          <p className="mt-10 text-center text-xs font-medium text-zinc-500">
            ¿Nuevo aquí?{' '}
            <Link to="/register" className="text-white hover:underline font-bold transition-all">
              Crea tu cuenta gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

