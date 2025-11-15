import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { NeuralPage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { CortexPage } from '@/pages/CortexPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
const App = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <NeuralPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "cortex", element: <CortexPage /> },
      // Mock pages for profile/settings for now
      { path: "profile", element: <div>Profile Page</div> },
      { path: "settings", element: <div>Settings Page</div> },
    ],
  },
  {
    path: "/login",
    element: <div>Login Page</div>, // Mock login page
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