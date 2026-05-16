import { User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProspectFieldsProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function ProspectFields({ name, email, onNameChange, onEmailChange }: ProspectFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
      {/* Row 1: Labels (Synchronized height via grid) */}
      <Label 
        htmlFor="prospect-name" 
        className="text-[10px] uppercase tracking-widest text-zinc-500 font-black leading-tight"
      >
        Nombre del Prospecto
      </Label>
      <Label 
        htmlFor="prospect-email" 
        className="text-[10px] uppercase tracking-widest text-zinc-500 font-black leading-tight"
      >
        Email (Opcional)
      </Label>

      {/* Row 2: Inputs (Guaranteed vertical alignment) */}
      <div className="relative">
        <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <Input 
          id="prospect-name" 
          placeholder="Nelson L." 
          className="pl-9 text-xs focus-visible:ring-zinc-950/20 dark:focus-visible:ring-white/20 border-zinc-200 dark:border-zinc-800 h-10 rounded-lg" 
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <Input 
          id="prospect-email" 
          placeholder="ejemplo@web.com" 
          className="pl-9 text-xs focus-visible:ring-zinc-950/20 dark:focus-visible:ring-white/20 border-zinc-200 dark:border-zinc-800 h-10 rounded-lg"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
    </div>
  );
}
