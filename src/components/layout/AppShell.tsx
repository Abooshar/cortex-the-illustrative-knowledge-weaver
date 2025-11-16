import { Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAppStore } from "@/stores/useAppStore";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export const AppShell = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);