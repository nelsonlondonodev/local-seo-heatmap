import { useEffect, memo } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BrandingProvider, useBranding } from '@/features/branding';
import { SidebarProvider } from '@/context/SidebarContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AIHistoryPage } from '@/pages/AIHistoryPage';
import { KeywordPage } from '@/pages/KeywordPage';
import { HeatmapResultPage } from '@/pages/HeatmapResultPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SiteAnalyzerPage } from '@/pages/SiteAnalyzerPage';
import { AdminPage } from '@/pages/AdminPage';
import { useSEOSync } from '@/hooks/useSEOSync';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

import { Outlet } from 'react-router-dom';

/**
 * Root component to manage global side-effects like SEO.
 */
function Root() {
  useSEOSync();
  return <Outlet />;
}

/**
 * Public routes should redirect to dashboard if user is authenticated.
 */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <AuthLoading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
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
          { path: '/ai-history', element: <AIHistoryPage /> },
          { path: '/market-discovery', element: <KeywordPage initialTab="discovery" /> },
          { path: '/site-analyzer', element: <SiteAnalyzerPage /> },
          { path: '/rank-tracker', element: <KeywordPage initialTab="monitoring" /> },
          { path: '/result', element: <HeatmapResultPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { 
            path: '/admin', 
            element: (
              <ProtectedRoute allowedRoles={['super-admin']}>
                <AdminPage />
              </ProtectedRoute>
            ) 
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
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
          <SidebarProvider>
            <BrandingSync />
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </SidebarProvider>
        </BrandingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
