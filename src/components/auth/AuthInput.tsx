import type { ReactNode, ChangeEvent, ComponentType } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="h-14 rounded-2xl bg-white/5 border-white/10 pl-11 pr-12 focus:border-primary/50 focus:ring-primary/20 transition-all text-white font-medium"
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
