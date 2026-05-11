import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { AuthInput } from './AuthInput';
import { AuthBrand } from './AuthBrand';
import { AuthSocial } from './AuthSocial';

interface LoginFormProps {
  from: string;
}

const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
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
    <div className="flex w-full flex-col justify-center px-8 lg:w-1/2">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 flex lg:hidden justify-center">
          <AuthBrand />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic lg:text-5xl">Bienvenido.</h1>
          <p className="text-zinc-300 font-bold mb-10">Ingresa tus credenciales para acceder.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            <div className="flex justify-end pr-1">
              <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                ¿Olvidaste la clave?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-lg shadow-xl shadow-primary/20" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Entrar al Dashboard'}
            </Button>
          </form>

          <AuthSocial 
            text="O continúa con" 
            onGoogleClick={signInWithGoogle} 
          />

          <p className="mt-10 text-center text-sm font-bold text-zinc-400">
            ¿Nuevo aquí?{' '}
            <Link to="/register" className="text-primary hover:underline font-black">
              Crea tu cuenta gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

