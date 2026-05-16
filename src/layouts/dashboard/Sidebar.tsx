import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, History, Settings, X, ChevronRight, Sparkles, 
  TrendingUp, Target, Globe, ShieldAlert, PanelLeftClose, 
  PanelLeftOpen, type LucideIcon 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import { UserSection } from './UserSection';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/SidebarContext';

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
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarLink({ path, label, icon: Icon, isActive, isCollapsed, onClick }: SidebarLinkProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        isActive
          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold"
          : "text-zinc-500 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-950 dark:hover:text-white",
        isCollapsed && "justify-center px-0"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
      
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}

      {isActive && !isCollapsed && (
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
  const { isCollapsed, toggle } = useSidebar();

  const itemsToRender = [...NAV_ITEMS];
  if (role === 'super-admin') {
    itemsToRender.push({ path: '/admin', label: 'Panel Admin', icon: ShieldAlert });
  }

  return (
    <>
      {/* Mobile Overlay */}
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
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed inset-y-0 left-0 z-[5000] border-r border-border bg-card lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header & Toggle */}
          <div className={cn("flex h-16 items-center px-6", isCollapsed && "px-0 justify-center")}>
            {!isCollapsed ? (
              <Logo textClassName="text-lg font-bold dark:text-white text-zinc-950" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center">
                <div className="h-4 w-4 rounded-sm border-2 border-white dark:border-zinc-950" />
              </div>
            )}
            
            {!isCollapsed && (
              <button
                className="ml-auto hidden lg:flex p-1.5 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                onClick={toggle}
                aria-label="Colapsar menú"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
            
            <button
              className="ml-auto lg:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto overflow-x-hidden">
            {itemsToRender.map((item) => (
              <SidebarLink
                key={item.path}
                {...item}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            ))}
          </nav>

          <Separator />

          {/* Bottom Actions (Toggle when collapsed) */}
          {isCollapsed && (
            <div className="flex justify-center p-3">
              <button
                className="p-2 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                onClick={toggle}
                aria-label="Expandir menú"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          )}

          <UserSection onLogoutClick={onLogoutClick} isCollapsed={isCollapsed} />
        </div>
      </motion.aside>
    </>
  );
}
