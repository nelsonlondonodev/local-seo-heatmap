import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth, type UserRole } from '@/features/auth';
import { APP_CONFIG } from '@/config/constants';

const navItems = [
  { path: '/dashboard', label: 'Mapa de Calor', icon: Map },
  { path: '/history', label: 'Historial', icon: History },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

const getRoleBadgeStyle = (role: UserRole | null) => {
  switch (role) {
    case 'super-admin':
      return 'bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm shadow-amber-200';
    case 'owner':
      return 'bg-blue-600 hover:bg-blue-700 text-white border-none';
    case 'admin':
      return 'bg-indigo-500 hover:bg-indigo-600 text-white border-none';
    case 'staff':
      return 'bg-emerald-500 hover:bg-emerald-600 text-white border-none';
    default:
      return 'bg-slate-500 hover:bg-slate-600 text-white border-none';
  }
};

export function DashboardLayout() {
  const { user, profile, role, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLogoutOpen(false);
    await signOut();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Map className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              {APP_CONFIG.name}
            </span>
            <button
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
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

          {/* User section */}
          <div className="p-4 mt-auto">
            <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4 border border-border/50 shadow-sm transition-all hover:bg-muted/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-background shadow-inner">
                {user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold tracking-tight text-foreground">
                  {profile?.full_name ?? user?.user_metadata?.full_name ?? 'Usuario'}
                </p>
                <div className="flex flex-col gap-1.5">
                  <p className="truncate text-[10px] font-medium text-muted-foreground/80 leading-none">
                    {user?.email ?? ''}
                  </p>
                  {role && (
                    <Badge className={`w-fit px-2 py-0 h-4 text-[9px] font-black uppercase tracking-wider ${getRoleBadgeStyle(role)} transition-all duration-300`}>
                      {role.replace('-', ' ')}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLogoutOpen(true)}
                className="h-9 w-9 shrink-0 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
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

        {/* Page content */}
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

      {/* Logout Confirmation Modal - TEMPORARILY DISABLED FOR DIAGNOSIS
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
      */}
    </div>
  );
}
