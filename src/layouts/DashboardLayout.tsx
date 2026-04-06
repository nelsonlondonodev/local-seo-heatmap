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
          <span className="text-lg font-bold">{config.name}</span>
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

      {/* Premium Logout Confirmation Modal */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-[420px] p-8 border-none shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-primary/5 pointer-events-none" />
          
          <DialogHeader className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-inner"
            >
              <LogOut className="h-10 w-10 stroke-[1.5]" />
            </motion.div>
            
            <DialogTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
              ¿Cerrar sesión?
            </DialogTitle>
            
            <DialogDescription className="text-center text-base text-muted-foreground pt-3 px-2 leading-relaxed">
              ¿Estás seguro de que deseas salir de <span className="font-semibold text-foreground">{config.name}</span>? 
              Se cerrará tu acceso actual de forma segura.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="relative z-10 mt-10 grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutOpen(false)}
              className="rounded-2xl h-12 font-bold text-base border-2 hover:bg-muted transition-all active:scale-95"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="rounded-2xl h-12 font-bold text-base bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/25 border-none transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
