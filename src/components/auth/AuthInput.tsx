import type { ReactNode, ChangeEvent, ComponentType } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: ComponentType<{ className?: string }>;
  rightElement?: ReactNode;
  required?: boolean;
  autoComplete?: string;
}

export function AuthInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
  required = true,
  autoComplete
}: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <Label 
        htmlFor={id} 
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1"
      >
        {label}
      </Label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={cn(
            "h-12 rounded-lg bg-zinc-900 border-zinc-800 pl-11 pr-12 transition-all duration-300",
            "text-white placeholder:text-zinc-600 font-medium",
            "hover:border-zinc-600 focus:border-white focus:ring-0 focus:bg-zinc-800/50"
          )}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
