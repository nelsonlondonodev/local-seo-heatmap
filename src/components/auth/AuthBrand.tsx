import { Map } from 'lucide-react';
import { useBranding } from '@/features/branding';

export function AuthBrand() {
  const { config } = useBranding();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
        <Map className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-white">{config.name}</span>
    </div>
  );
}
