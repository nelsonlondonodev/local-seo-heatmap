import { Map } from 'lucide-react';
import { useBranding } from '@/features/branding';

export function Footer() {
  const { config } = useBranding();

  return (
    <footer className="py-32 border-t border-white/5 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                <Map className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter">{config.name}</span>
            </div>
            <p className="text-slate-500 font-bold text-xl leading-relaxed max-w-md">
              La plataforma de inteligencia competitiva definitiva para dominar el SEO Local.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Producto</h5>
              <ul className="space-y-4 text-lg font-bold text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Heatmaps</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Keywords</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Soporte</h5>
              <ul className="space-y-4 text-lg font-bold text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Ayuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Legal</h5>
              <ul className="space-y-4 text-lg font-bold text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-16 border-t border-white/5 text-center">
          <p className="text-slate-600 font-bold">
            © {new Date().getFullYear()} {config.name}. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
