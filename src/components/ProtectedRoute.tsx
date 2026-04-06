import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import type { ReactNode } from 'react';
import { AuthLoading } from './auth/AuthLoading';

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

  // If we haven't determined the user existence AND we're loading, show loader.
  // BUT: If user is present, even during loading (re-syncing profile), let them stay on the page.
  if (isLoading && !user) {
    return (
      <AuthLoading 
        message="Sincronizando sesión" 
        submessage="Tu dashboard aparecerá en un momento..." 
      />
    );
  }

  // If there is no user at all after loading or during a signed_out event, bounce to login.
  if (!user && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
