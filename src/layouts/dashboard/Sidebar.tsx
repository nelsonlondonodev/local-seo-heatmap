import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, History, Settings, X, ChevronRight, Sparkles, TrendingUp, Target, Globe, ShieldAlert, type LucideIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import { UserSection } from './UserSection';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Mapa de Calor', icon: Map },
  { path: '/market-discovery', label: 'Analizador de Mercado', icon: TrendingUp },
  { path: '/site-analyzer', label: 'Explorador de Sitios', icon: Globe },
  { path: '/rank-tracker', label: 'Rastreador de Posiciones', icon: Target },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/ai-history', label: 'Contenidos IA', icon: Sparkles },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

interface SidebarLinkProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

function SidebarLink({ path, label, icon: Icon, isActive, onClick }: SidebarLinkProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        isActive
          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold"
          : "text-zinc-500 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-950 dark:hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
      {label}
      {isActive && (
        <ChevronRight className="ml-auto h-4 w-4 text-zinc-400 dark:text-zinc-600" />
      )}
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

export function Sidebar({ isOpen, onClose, onLogoutClick }: SidebarProps) {
  const location = useLocation();
  const { role } = useAuth();

  const itemsToRender = [...NAV_ITEMS];
  if (role === 'super-admin') {
    itemsToRender.push({ path: '/admin', label: 'Panel Admin', icon: ShieldAlert });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4900] bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-[5000] w-64 border-r border-border bg-card lg:static lg:z-auto transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <Logo textClassName="text-lg font-bold dark:text-white text-zinc-950" />
            <button
              className="ml-auto lg:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Separator />

          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {itemsToRender.map((item) => (
              <SidebarLink
                key={item.path}
                {...item}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            ))}
          </nav>

          <Separator />

          <UserSection onLogoutClick={onLogoutClick} />
        </div>
      </motion.aside>
    </>
  );
}
