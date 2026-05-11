import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AuthSuccessProps {
  email: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function AuthSuccess({ email, title, description, buttonText, buttonLink }: AuthSuccessProps) {
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
             <h2 className="text-4xl font-black tracking-tighter text-white italic">{title}</h2>
             <p className="text-zinc-400 font-bold px-4">
               {description} <span className="text-white">{email}</span>. Confírmalo para acceder al dashboard.
             </p>
           </div>
        </div>
        <Link to={buttonLink}>
          <Button variant="outline" className="h-14 px-10 rounded-2xl font-black border-white/10 hover:bg-white/5 transition-all active:scale-[0.98]">
            {buttonText}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
