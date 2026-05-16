import { 
  Map, History, Settings, Sparkles, TrendingUp, 
  Target, Globe, ShieldAlert, type LucideIcon 
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Mapa de Calor', icon: Map },
  { path: '/market-discovery', label: 'Analizador de Mercado', icon: TrendingUp },
  { path: '/site-analyzer', label: 'Explorador de Sitios', icon: Globe },
  { path: '/rank-tracker', label: 'Rastreador de Posiciones', icon: Target },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/ai-history', label: 'Contenidos IA', icon: Sparkles },
  { path: '/settings', label: 'Configuración', icon: Settings },
  { path: '/admin', label: 'Panel Admin', icon: ShieldAlert, adminOnly: true },
];
