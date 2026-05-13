import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthSuccessProps {
  email: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function AuthSuccess({ email, title, description, buttonText, buttonLink }: AuthSuccessProps) {
  return (
    <div className="flex w-full flex-col justify-center px-6 lg:px-12 lg:w-1/2 bg-zinc-950">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mx-auto w-full max-w-sm text-center"
      >
        <div className="mb-10 flex flex-col items-center gap-6">
           <div className="h-16 w-16 rounded-xl bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
              <Mail className="h-8 w-8" />
           </div>
           <div className="space-y-3">
             <h2 className="text-4xl font-bold tracking-tighter text-white">{title}</h2>
             <p className="text-sm text-zinc-500 font-medium px-4 leading-relaxed">
               {description} <span className="text-white font-bold">{email}</span>. <br />
               Confírmalo para acceder al panel de control.
             </p>
           </div>
        </div>

        <Link to={buttonLink}>
          <Button 
            className={cn(
              "w-full h-12 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-bold text-sm",
              "active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            )}
          >
            {buttonText}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
