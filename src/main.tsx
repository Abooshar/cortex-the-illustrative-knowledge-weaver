import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { NeuralPage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { CortexPage } from '@/pages/CortexPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useCortexStore } from './stores/useCortexStore';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useCortexStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
const AppLayout = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <NeuralPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "cortex", element: <CortexPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);