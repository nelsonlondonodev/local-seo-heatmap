import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { AuthInput } from './AuthInput';
import { AuthBrand } from './AuthBrand';
import { toast } from 'sonner';

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

  async function handleSubmit(e: React.FormEvent) {
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
  }

  if (isEmailSent) {
    return (
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="mx-auto w-full max-w-md text-center"
        >
          <div className="mb-10 flex flex-col items-center gap-6">
             <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-primary/20">
                <Mail className="h-10 w-10" />
             </div>
             <div className="space-y-2">
               <h2 className="text-4xl font-black tracking-tighter text-white italic">¡Casi listo!</h2>
               <p className="text-zinc-400 font-bold px-4">
                 Hemos enviado un link a <span className="text-white">{email}</span>. Confírmalo para acceder al dashboard.
               </p>
             </div>
          </div>
          <Link to="/login">
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black border-white/10 hover:bg-white/5 transition-all">
              Volver al inicio de sesión
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 flex lg:hidden justify-center">
          <AuthBrand />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
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

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-zinc-400">
              <span className="bg-[#030712] px-4">O regístrate con</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl bg-transparent border-white/10 hover:bg-white/5 font-black gap-3 text-white transition-all"
            onClick={() => signInWithGoogle()}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>

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
