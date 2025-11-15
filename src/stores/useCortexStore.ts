import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cortexContent, mockUser } from '@/lib/mock-data';
import type { CortexItem } from '@/lib/mock-data';
import { arrayMove } from '@dnd-kit/sortable';
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
    overContainer: KanbanColumnId
  ) => void;
  reorderTask: (
    activeId: string,
    overId: string,
    container: KanbanColumnId
  ) => void;
};
const initialKanbanColumns: Record<KanbanColumnId, KanbanColumn> = {
  draft: { id: 'draft', title: 'Draft', items: [] },
  in_progress: { id: 'in_progress', title: 'In Progress', items: [] },
  published: { id: 'published', title: 'Published', items: [] },
};
// Distribute initial content into Kanban columns
cortexContent.forEach(item => {
  if (initialKanbanColumns[item.status]) {
    initialKanbanColumns[item.status].items.push(item);
  } else {
    // Fallback for any other status
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
        // Find and remove from the old container
        let activeContainer: KanbanColumnId | null = null;
        for (const colId in state.kanbanColumns) {
          const column = state.kanbanColumns[colId as KanbanColumnId];
          const itemIndex = column.items.findIndex(item => item.id === activeId);
          if (itemIndex !== -1) {
            activeContainer = colId as KanbanColumnId;
            column.items.splice(itemIndex, 1);
            break;
          }
        }
        if (!activeContainer) return;
        // Add to the new container
        const targetColumn = state.kanbanColumns[overContainer];
        if (targetColumn) {
          const overIndex = overId ? targetColumn.items.findIndex(item => item.id === overId) : targetColumn.items.length;
          targetColumn.items.splice(overIndex, 0, activeItem);
          activeItem.status = overContainer;
        }
      }),
    reorderTask: (activeId, overId, container) =>
      set((state) => {
        const column = state.kanbanColumns[container];
        if (column) {
          const oldIndex = column.items.findIndex(item => item.id === activeId);
          const newIndex = column.items.findIndex(item => item.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            column.items = arrayMove(column.items, oldIndex, newIndex);
          }
        }
      }),
  }))
);