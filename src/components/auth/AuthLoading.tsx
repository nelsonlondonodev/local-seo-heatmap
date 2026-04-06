import { motion } from 'framer-motion';
import { Map } from 'lucide-react';

interface AuthLoadingProps {
  message?: string;
  submessage?: string;
}

/**
 * Atomic Loading Component for Auth States.
 * Designed with premium aesthetics, glassmorphism and smooth animations.
 */
export function AuthLoading({ 
  message = "Verificando acceso", 
  submessage = "Por favor espera un momento..." 
}: AuthLoadingProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-6">
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 blur-[80px] bg-brand-primary/20 rounded-full" />
        <div className="absolute inset-0 -z-10 h-24 w-24 translate-x-1/4 translate-y-1/4 blur-[60px] bg-blue-500/10 rounded-full" />

        {/* Dynamic Spinner with Icon */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-20 w-20 rounded-full border-[3px] border-muted border-t-brand-primary"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20"
            >
              <Map className="h-5 w-5 text-primary-foreground" />
            </motion.div>
          </div>
        </div>

        {/* Text Section with Smooth Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {message}
          </h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground/80">
            {submessage}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
