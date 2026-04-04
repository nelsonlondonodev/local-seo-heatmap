import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Higher Order Component to protect routes.
 * Refined to avoid flickering during profile sync.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If we haven't determined the user existance AND we're loading, show spinner.
  // BUT: If user is present, even during loading (re-syncing profile), let them stay on the page.
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent shadow-xl shadow-brand-primary/10" />
          <div className="flex flex-col items-center gap-1">
             <p className="text-lg font-bold tracking-tight">Sincronizando sesión</p>
             <p className="text-sm text-muted-foreground">Tu dashboard aparecerá en un momento</p>
          </div>
        </div>
      </div>
    );
  }

  // If there is no user at all after loading or during a signed_out event, bounce to login.
  if (!user && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
