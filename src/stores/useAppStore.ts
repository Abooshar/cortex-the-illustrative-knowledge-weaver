import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { arrayMove } from '@dnd-kit/sortable';
import type { KnowledgeGraph, KnowledgeNode, NodeStatus, KnowledgeLink } from '@/types/knowledge';
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
  // UI State
  isEditorOpen: boolean;
  editingNode: KnowledgeNode | null;
  // Kanban derived state
  kanbanColumns: Record<KanbanColumnId, KanbanColumn>;
  // Actions
  login: () => void;
  logout: () => void;
  fetchGraph: () => Promise<void>;
  updateGraph: (graph: KnowledgeGraph) => Promise<void>;
  moveTask: (activeId: string, overId: string | null, newColumnId: KanbanColumnId) => void;
  reorderTask: (activeId: string, overId: string, columnId: KanbanColumnId) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  setEditingNode: (node: KnowledgeNode | null) => void;
  createNode: (node: KnowledgeNode) => void;
  updateNode: (node: KnowledgeNode) => void;
  deleteNode: (nodeId: string) => void;
  resetGraph: () => Promise<void>;
  createLink: (link: KnowledgeLink) => void;
  deleteLink: (sourceId: string, targetId: string) => void;
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
    isEditorOpen: false,
    editingNode: null,
    kanbanColumns: recomputeKanbanColumns([]),
    // --- ACTIONS ---
    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
    setIsEditorOpen: (isOpen) => set({ isEditorOpen: isOpen }),
    setEditingNode: (node) => set({ editingNode: node }),
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
      }
    },
    createNode: (node) => {
      const { graph, updateGraph } = get();
      const newGraph = { ...graph, nodes: [...graph.nodes, node] };
      updateGraph(newGraph);
    },
    updateNode: (updatedNode) => {
      const { graph, updateGraph } = get();
      const newNodes = graph.nodes.map(n => (n.id === updatedNode.id ? updatedNode : n));
      const newGraph = { ...graph, nodes: newNodes };
      updateGraph(newGraph);
    },
    deleteNode: (nodeId) => {
      const { graph, updateGraph } = get();
      const newNodes = graph.nodes.filter(n => n.id !== nodeId);
      const newLinks = graph.links.filter(l => l.source !== nodeId && l.target !== nodeId);
      const newGraph = { nodes: newNodes, links: newLinks };
      updateGraph(newGraph);
    },
    resetGraph: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch('/api/graph/reset', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to reset graph');
        const result = await response.json();
        if (result.success && result.data) {
          const graphData = result.data as KnowledgeGraph;
          set(state => {
            state.graph = graphData;
            state.kanbanColumns = recomputeKanbanColumns(graphData.nodes);
            state.isLoading = false;
            state.error = null;
          });
        } else {
          throw new Error(result.error || 'Failed to reset graph');
        }
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      }
    },
    createLink: (link) => {
      const { graph, updateGraph } = get();
      const newGraph = { ...graph, links: [...graph.links, link] };
      updateGraph(newGraph);
    },
    deleteLink: (sourceId, targetId) => {
      const { graph, updateGraph } = get();
      const newLinks = graph.links.filter(l => !(l.source === sourceId && l.target === targetId));
      const newGraph = { ...graph, links: newLinks };
      updateGraph(newGraph);
    },
    moveTask: (activeId, overId, newColumnId) => {
      const { graph, updateGraph } = get();
      const newNodes = [...graph.nodes];
      const activeNodeIndex = newNodes.findIndex(n => n.id === activeId);
      if (activeNodeIndex === -1) return;
      newNodes[activeNodeIndex].status = newColumnId as NodeStatus;
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