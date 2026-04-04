import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Eye, EyeOff, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import { useBranding } from '@/features/branding';
import { toast } from 'sonner';

const benefits = [
  'Escaneos rápidos en vivo',
  'Mapa de calor interactivo',
  'Historial de análisis',
  'Sin tarjeta de crédito',
];

/**
 * Robust RegisterPage with support for unconfirmed emails.
 */
export function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const { config } = useBranding();
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
      // In Supabase, if confirmation is ON, this won't return a session
      await signUp(email, password, fullName);
      
      // If we got here without error, the user is likely created
      setIsEmailSent(true);
      toast.info('Revisa tu correo para confirmar tu cuenta');
      
      // We wait a bit to navigate to login if email confirmation is needed
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

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error con Google Sign-In');
    }
  }

  if (isEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
          <div className="mb-8 flex flex-col items-center gap-4">
             <div className="h-16 w-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-xl shadow-brand-primary/10">
                <Mail className="h-8 w-8" />
             </div>
             <h2 className="text-3xl font-extrabold tracking-tight">¡Casi listo!</h2>
             <p className="text-muted-foreground text-lg px-4">
               Hemos enviado un link a <strong>{email}</strong>. Por favor, confírmalo para poder entrar al dashboard.
             </p>
          </div>
          <Link to="/login">
            <Button variant="outline" className="h-11 px-8 rounded-xl font-bold">Volver al inicio de sesión</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-brand-primary/5 blur-3xl opacity-50" />
        <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-3xl opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo and Dynamic Branding Name */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {config.logoUrl ? (
             <img src={config.logoUrl} alt={config.name} className="h-12 w-auto object-contain mb-2" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20">
              <Map className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Crea tu cuenta gratis</CardTitle>
            <CardDescription>
              Comienza a rastrear tu posicionamiento hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Features list */}
            <div className="mb-6 grid grid-cols-2 gap-3 pt-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-primary" />
                  {benefit}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan García"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={6}
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-brand-primary hover:opacity-90 font-bold shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all mt-4" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : (
                  'Registrarme Gratis'
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-xs font-medium text-muted-foreground">
                O regístrate con
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl gap-2 font-semibold border-2 hover:bg-muted active:scale-[0.98] transition-all"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-bold text-brand-primary hover:underline transition-colors">
                Inicia sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
