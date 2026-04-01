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
import { APP_CONFIG } from '@/config/constants';
import { Sidebar } from './dashboard/Sidebar';

/**
 * Main Layout for the Dashboard. 
 * Refactored into atomic components for scalability and clean code.
 */
export function DashboardLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLogoutOpen(false);
    await signOut();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Atomic Sidebar & Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogoutClick={() => setIsLogoutOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header Overlay */}
        <header className="flex h-16 items-center gap-4 border-b border-border px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold">{APP_CONFIG.name}</span>
        </header>

        {/* Dynamic Page Content with Transitions */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
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

      {/* Improved Logout Confirmation Modal */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              ¿Cerrar sesión?
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              ¿Estás seguro de que deseas salir de <strong>{APP_CONFIG.name}</strong>? 
              Tendrás que volver a autenticarte para acceder a tus mapas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex sm:flex-col-reverse gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutOpen(false)}
              className="flex-1 rounded-xl h-11 font-semibold"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="flex-1 rounded-xl h-11 font-semibold shadow-lg shadow-destructive/20 active:scale-[0.98] transition-transform"
            >
              Sí, cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
