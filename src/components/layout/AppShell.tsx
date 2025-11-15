import { Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAppStore } from "@/stores/useAppStore";
import { QuickCapture } from "@/components/QuickCapture";
import { NodeEditor } from "@/components/NodeEditor";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export const AppShell = () => {
  const isEditorOpen = useAppStore(state => state.isEditorOpen);
  const setIsEditorOpen = useAppStore(state => state.setIsEditorOpen);
  const editingNode = useAppStore(state => state.editingNode);
  return (
    <ProtectedRoute>
      <MainLayout>
        <Outlet />
        <QuickCapture />
        <NodeEditor
          isOpen={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          nodeToEdit={editingNode}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};