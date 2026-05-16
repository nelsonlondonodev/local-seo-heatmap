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
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label htmlFor="prospect-name" className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
          Nombre del Prospecto
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <Input 
            id="prospect-name" 
            placeholder="Nelson L." 
            className="pl-9 text-xs focus-visible:ring-zinc-950/20 dark:focus-visible:ring-white/20 border-zinc-200 dark:border-zinc-800" 
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prospect-email" className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
          Email (Opcional)
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <Input 
            id="prospect-email" 
            placeholder="ejemplo@web.com" 
            className="pl-9 text-xs focus-visible:ring-zinc-950/20 dark:focus-visible:ring-white/20 border-zinc-200 dark:border-zinc-800"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
