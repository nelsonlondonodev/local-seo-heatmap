import { useEffect, memo } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BrandingProvider, useBranding } from '@/features/branding';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

/**
 * Public routes should redirect to dashboard if user is authenticated.
 * Optimistic version: allows child rendering while loading to avoid "Blank White Screen" 
 * but still enforces protection once state is confirmed.
 */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // If we are loading but have NO user yet, show children optimistically 
  // to avoid blocking the UI by ghosted session checks.
  if (isLoading && !user) {
    return <>{children}</>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { 
    path: '/login', 
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ) 
  },
  { 
    path: '/register', 
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ) 
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

/**
 * Component to sync Agency ID from Auth context to Branding context.
 * Decoupled from RouterProvider mount lifecycle.
 */
const BrandingSync = memo(() => {
  const { agencyId } = useAuth();
  const { setAgencyId } = useBranding();

  useEffect(() => {
    setAgencyId(agencyId);
  }, [agencyId, setAgencyId]);

  return null; 
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrandingProvider>
          <BrandingSync />
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </BrandingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
