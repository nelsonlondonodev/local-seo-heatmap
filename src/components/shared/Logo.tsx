import { Link } from 'react-router-dom';
import { useBranding } from '@/features/branding';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export function Logo({ className, textClassName }: LogoProps) {
  const { config } = useBranding();

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center hover:opacity-80 transition-all active:scale-95 duration-200 group",
        className
      )}
    >
      <span className={cn(
        "text-xl font-bold tracking-tighter text-white uppercase",
        textClassName
      )}>
        {config.name}
      </span>
    </Link>
  );
}
