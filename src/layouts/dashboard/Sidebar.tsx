import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, History, Settings, X, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useBranding } from '@/features/branding';
import { UserSection } from './UserSection';

const navItems = [
  { path: '/dashboard', label: 'Mapa de Calor', icon: Map },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

/**
 * Atomic Sidebar component for Navigation and Profile access.
 */
export function Sidebar({ isOpen, onClose, onLogoutClick }: SidebarProps) {
  const location = useLocation();
  const { config } = useBranding();

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

      {/* Sidebar Content */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-[5000] w-64 border-r border-border bg-card lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center gap-2 px-6">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.name} className="h-8 w-auto object-contain" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm">
                <Map className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <span className="text-lg font-bold tracking-tight">
              {config.name}
            </span>
            <button
              className="ml-auto lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Separator />

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* Atomic User Section */}
          <UserSection onLogoutClick={onLogoutClick} />
        </div>
      </motion.aside>
    </>
  );
}
