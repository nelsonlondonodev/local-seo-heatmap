import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';
import { useBranding } from '@/features/branding';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({ className, iconClassName, textClassName }: LogoProps) {
  const { config } = useBranding();

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-3 hover:opacity-80 transition-all active:scale-95 duration-200 group",
        className
      )}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all",
        iconClassName
      )}>
        <Map className="h-6 w-6 text-white" />
      </div>
      <span className={cn(
        "text-2xl font-black tracking-tighter text-white",
        textClassName
      )}>
        {config.name}
      </span>
    </Link>
  );
}
