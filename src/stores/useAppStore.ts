import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { arrayMove } from '@dnd-kit/sortable';
import type { KnowledgeGraph, KnowledgeNode, NodeStatus } from '@/types/knowledge';
export type KanbanColumnId = 'idea' | 'backlog' | 'in_progress' | 'done';
export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  items: KnowledgeNode[];
}
export interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: { name: string; email: string };
  // Knowledge Graph
  graph: KnowledgeGraph;
  isLoading: boolean;
  error: string | null;
  // Kanban derived state
  kanbanColumns: Record<KanbanColumnId, KanbanColumn>;
  // Actions
  login: () => void;
  logout: () => void;
  fetchGraph: () => Promise<void>;
  updateGraph: (graph: KnowledgeGraph) => Promise<void>;
  moveTask: (activeId: string, overId: string | null, newColumnId: KanbanColumnId) => void;
  reorderTask: (activeId: string, overId: string, columnId: KanbanColumnId) => void;
}
const recomputeKanbanColumns = (nodes: KnowledgeNode[]): Record<KanbanColumnId, KanbanColumn> => {
  const columns: Record<KanbanColumnId, KanbanColumn> = {
    idea: { id: 'idea', title: 'Ideas', items: [] },
    backlog: { id: 'backlog', title: 'Backlog', items: [] },
    in_progress: { id: 'in_progress', title: 'In Progress', items: [] },
    done: { id: 'done', title: 'Done', items: [] },
  };
  nodes.forEach(node => {
    const status = node.status as KanbanColumnId;
    if (columns[status]) {
      columns[status].items.push(node);
    }
  });
  return columns;
};
export const useAppStore = create<AppState>()(
  immer((set, get) => ({
    // --- STATE ---
    isAuthenticated: false,
    user: { name: 'Demo User', email: 'demo@cortex.dev' },
    graph: { nodes: [], links: [] },
    isLoading: true,
    error: null,
    kanbanColumns: recomputeKanbanColumns([]),
    // --- ACTIONS ---
    login: () => {
      set(state => {
        state.isAuthenticated = true;
      });
    },
    logout: () => {
      set(state => {
        state.isAuthenticated = false;
      });
    },
    fetchGraph: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('/api/graph');
        if (!response.ok) throw new Error('Failed to fetch knowledge graph');
        const result = await response.json();
        if (result.success && result.data) {
          const graphData = result.data as KnowledgeGraph;
          set(state => {
            state.graph = graphData;
            state.kanbanColumns = recomputeKanbanColumns(graphData.nodes);
            state.isLoading = false;
          });
        } else {
          throw new Error(result.error || 'Unknown API error');
        }
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      }
    },
    updateGraph: async (newGraph: KnowledgeGraph) => {
      try {
        await fetch('/api/graph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGraph),
        });
        set(state => {
          state.graph = newGraph;
          state.kanbanColumns = recomputeKanbanColumns(newGraph.nodes);
        });
      } catch (error) {
        console.error("Failed to update graph:", error);
        // Optionally revert state or show an error to the user
      }
    },
    moveTask: (activeId, overId, newColumnId) => {
      const { graph, updateGraph } = get();
      const newNodes = [...graph.nodes];
      const activeNodeIndex = newNodes.findIndex(n => n.id === activeId);
      if (activeNodeIndex === -1) return;
      // Update status
      newNodes[activeNodeIndex].status = newColumnId as NodeStatus;
      // If not just dropping on a column, reorder
      if (overId) {
        const overNodeIndex = newNodes.findIndex(n => n.id === overId);
        if (overNodeIndex !== -1) {
            const [movedItem] = newNodes.splice(activeNodeIndex, 1);
            const newIndex = newNodes.findIndex(n => n.id === overId);
            newNodes.splice(newIndex, 0, movedItem);
        }
      }
      updateGraph({ ...graph, nodes: newNodes });
    },
    reorderTask: (activeId, overId, columnId) => {
      const { graph, updateGraph, kanbanColumns } = get();
      const columnItems = kanbanColumns[columnId].items;
      const oldIndex = columnItems.findIndex(item => item.id === activeId);
      const newIndex = columnItems.findIndex(item => item.id === overId);
      const reorderedColumnItems = arrayMove(columnItems, oldIndex, newIndex);
      const otherNodes = graph.nodes.filter(node => node.status !== columnId);
      const newNodes = [...otherNodes, ...reorderedColumnItems];
      updateGraph({ ...graph, nodes: newNodes });
    },
  }))
);