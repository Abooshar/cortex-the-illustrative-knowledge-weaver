import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cortexContent, mockUser } from '@/lib/mock-data';
import type { CortexItem } from '@/lib/mock-data';
export type KanbanColumnId = 'draft' | 'in_progress' | 'published';
export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  items: CortexItem[];
}
type CortexState = {
  isAuthenticated: boolean;
  user: typeof mockUser;
  kanbanColumns: Record<KanbanColumnId, KanbanColumn>;
};
type CortexActions = {
  login: () => void;
  logout: () => void;
  moveTask: (
    activeId: string,
    overId: string | null,
    overContainer: KanbanColumnId | null
  ) => void;
};
const initialKanbanColumns: Record<KanbanColumnId, KanbanColumn> = {
  draft: { id: 'draft', title: 'Draft', items: [] },
  in_progress: { id: 'in_progress', title: 'In Progress', items: [] },
  published: { id: 'published', title: 'Published', items: [] },
};
// Distribute initial content into Kanban columns
cortexContent.forEach(item => {
  if (item.status === 'draft') {
    initialKanbanColumns.draft.items.push(item);
  } else if (item.status === 'published') {
    initialKanbanColumns.published.items.push(item);
  } else {
    // For any other status, let's put them in 'in_progress' for the demo
    initialKanbanColumns.in_progress.items.push(item);
  }
});
export const useCortexStore = create<CortexState & CortexActions>()(
  immer((set) => ({
    isAuthenticated: true, // Changed for demo purposes
    user: mockUser,
    kanbanColumns: initialKanbanColumns,
    login: () =>
      set((state) => {
        state.isAuthenticated = true;
      }),
    logout: () =>
      set((state) => {
        state.isAuthenticated = false;
      }),
    moveTask: (activeId, overId, overContainer) =>
      set((state) => {
        const activeItem = cortexContent.find(item => item.id === activeId);
        if (!activeItem) return;
        // Find current container
        let activeContainer: KanbanColumnId | null = null;
        for (const colId in state.kanbanColumns) {
            if (state.kanbanColumns[colId as KanbanColumnId].items.some(item => item.id === activeId)) {
                activeContainer = colId as KanbanColumnId;
                break;
            }
        }
        if (!activeContainer) return;
        // Remove from old container
        const activeIndex = state.kanbanColumns[activeContainer].items.findIndex(item => item.id === activeId);
        state.kanbanColumns[activeContainer].items.splice(activeIndex, 1);
        // Add to new container
        const targetContainer = overContainer || activeContainer;
        if (state.kanbanColumns[targetContainer]) {
            const overIndex = overId ? state.kanbanColumns[targetContainer].items.findIndex(item => item.id === overId) : state.kanbanColumns[targetContainer].items.length;
            state.kanbanColumns[targetContainer].items.splice(overIndex, 0, activeItem);
            // Update status
            activeItem.status = targetContainer;
        }
      }),
  }))
);