import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import { useSidebar } from '@/context/SidebarContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { NAV_ITEMS } from '@/config/navigation';
import { cn } from '@/lib/utils';

// Atomic Components
import { SidebarItem } from './components/SidebarItem';
import { SidebarHeader } from './components/SidebarHeader';
import { UserSection } from './UserSection';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

/**
 * Organism: Sidebar
 * Orchestrates navigation items, user session, and responsive layout states.
 */
export function Sidebar({ isOpen, onClose, onLogoutClick }: SidebarProps) {
  const location = useLocation();
  const { role } = useAuth();
  const { isCollapsed, toggle } = useSidebar();
  const isMobile = useIsMobile();

  // Robust Logic: On mobile/tablet, the sidebar should NEVER render in collapsed mode.
  const shouldRenderCollapsed = isMobile ? false : isCollapsed;

  const itemsToRender = NAV_ITEMS.filter(item => !item.adminOnly || role === 'super-admin');

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
        className={cn(
          "fixed inset-y-0 left-0 z-[5000] w-64 border-r border-border bg-card lg:static lg:z-auto overflow-hidden transition-all duration-300 ease-in-out lg:w-full",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader 
            isCollapsed={shouldRenderCollapsed} 
            isMobile={isMobile}
            onToggle={toggle} 
            onClose={onClose} 
          />

          <Separator />

          <nav className="flex-1 space-y-1 p-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {itemsToRender.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                isCollapsed={shouldRenderCollapsed}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            ))}
          </nav>

          <Separator />

          {/* Bottom Expand Trigger (Only visible when collapsed on Desktop) */}
          <AnimatePresence>
            {shouldRenderCollapsed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex justify-center p-3"
              >
                <button
                  className="p-2 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                  onClick={toggle}
                  aria-label="Expandir menú"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <UserSection onLogoutClick={onLogoutClick} isCollapsed={shouldRenderCollapsed} />
        </div>
      </motion.aside>
    </>
  );
}
