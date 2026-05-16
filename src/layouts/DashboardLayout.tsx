import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/features/auth';
import { useBranding } from '@/features/branding';
import { Sidebar } from './dashboard/Sidebar';

/**
 * Main Layout for the Dashboard. 
 * Refactored into atomic components for scalability and clean code.
 * Now supports dynamic white-label branding.
 */
export function DashboardLayout() {
  const { signOut } = useAuth();
  const { config } = useBranding();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLogoutOpen(false);
    await signOut();
  };

  return (
    <div className="dashboard-grid h-screen overflow-hidden bg-background transition-all duration-300 ease-in-out">
      {/* Atomic Sidebar & Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogoutClick={() => setIsLogoutOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Overlay */}
        <header className="flex h-16 items-center gap-4 border-b border-border px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold">{config.name}</span>
        </header>

        {/* Dynamic Page Content with Transitions */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Premium Minimalist Logout Confirmation Modal */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-[400px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
          <DialogHeader className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white"
            >
              <LogOut className="h-6 w-6 stroke-[1.5]" />
            </motion.div>
            
            <DialogTitle className="text-center text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Cerrar sesión
            </DialogTitle>
            
            <DialogDescription className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2 px-2 leading-relaxed">
              ¿Estás seguro de que deseas salir de <span className="font-medium text-zinc-950 dark:text-white">{config.name}</span>? 
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutOpen(false)}
              className="rounded-md h-10 font-semibold text-sm border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-none transition-colors"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSignOut}
              className="rounded-md h-10 font-semibold text-sm bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-none transition-colors"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
