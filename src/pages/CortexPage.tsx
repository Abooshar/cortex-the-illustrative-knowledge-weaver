import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Table, KanbanSquare, FolderKanban, MoreHorizontal, Loader, Edit, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAppStore } from '@/stores/useAppStore';
import type { KanbanColumn, KanbanColumnId } from '@/stores/useAppStore';
import type { KnowledgeNode } from '@/types/knowledge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
const StaticTaskCard = ({ item }: { item: KnowledgeNode }) => {
  return (
    <Card className="mb-4 bg-background touch-none shadow-lg">
      <CardContent className="p-3">
        <p className="font-semibold text-sm mb-2">{item.name}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize text-xs">{item.type}</Badge>
          <span className="text-xs text-muted-foreground">{format(new Date(item.createdAt), 'MMM d')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
const SortableTaskCard = ({ item }: { item: KnowledgeNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4 bg-background touch-none">
      <CardContent className="p-3">
        <p className="font-semibold text-sm mb-2">{item.name}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize text-xs">{item.type}</Badge>
          <span className="text-xs text-muted-foreground">{format(new Date(item.createdAt), 'MMM d')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
const KanbanColumnComponent = ({ column }: { column: KanbanColumn }) => {
  return (
    <div className="w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-muted-foreground">{column.items.length}</span>
      </div>
      <Card className="bg-muted/50 p-2 min-h-[200px]">
        <SortableContext items={column.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {column.items.map(item => <SortableTaskCard key={item.id} item={item} />)}
        </SortableContext>
      </Card>
    </div>
  );
};
export function CortexPage() {
  const store = useAppStore();
  const { kanbanColumns, moveTask, reorderTask, fetchGraph, graph, isLoading, error, setEditingNode, setIsEditorOpen, deleteNode } = store;
  useEffect(() => {
    if (graph.nodes.length === 0) {
      fetchGraph();
    }
  }, [fetchGraph, graph.nodes.length]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<KnowledgeNode | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const activeContainer = active.data.current?.sortable.containerId as KanbanColumnId;
    const overContainer = over.data.current?.sortable.containerId as KanbanColumnId || (over.data.current?.sortable.items.find((i: KnowledgeNode) => i.id === over.id)?.status as KanbanColumnId);
    if (activeContainer === overContainer) {
      reorderTask(active.id as string, over.id as string, activeContainer);
    } else if (overContainer) {
      moveTask(active.id as string, over.id as string, overContainer);
    }
  };
  const handleEdit = (item: KnowledgeNode) => {
    setEditingNode(item);
    setIsEditorOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (nodeToDelete) {
      deleteNode(nodeToDelete.id);
      setNodeToDelete(null);
    }
  };
  const activeTask = activeId ? graph.nodes.find(item => item.id === activeId) : null;
  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-cortex-primary" /></div>;
  }
  if (error) {
    return <div className="h-full flex items-center justify-center"><p className="text-destructive-foreground bg-destructive p-4 rounded-md">Error: {error}</p></div>;
  }
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <FolderKanban className="w-8 h-8 text-cortex-primary" />
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Content Cortex</h1>
            <p className="text-sm text-muted-foreground">Organize and manage all your knowledge items.</p>
          </div>
        </div>
      </motion.div>
      <Tabs defaultValue="table" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="table"><Table className="w-4 h-4 mr-2" />Table</TabsTrigger>
          <TabsTrigger value="grid"><LayoutGrid className="w-4 h-4 mr-2" />Grid</TabsTrigger>
          <TabsTrigger value="list"><List className="w-4 h-4 mr-2" />List</TabsTrigger>
          <TabsTrigger value="kanban"><KanbanSquare className="w-4 h-4 mr-2" />Kanban</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="flex-1 mt-4">
          <Card className="h-full border-border/50 shadow-lg">
            <CardHeader><CardTitle className="font-sans font-semibold">All Content</CardTitle></CardHeader>
            <CardContent>
              <ShadcnTable>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Keywords</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {graph.nodes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{item.type}</Badge></TableCell>
                      <TableCell><Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="capitalize">{item.status}</Badge></TableCell>
                      <TableCell>{format(new Date(item.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="space-x-1">{item.keywords.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(item)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setNodeToDelete(item)} className="text-red-500"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ShadcnTable>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid" className="flex-1 mt-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{graph.nodes.map(item => (<Card key={item.id} className="flex flex-col justify-between"><CardHeader><CardTitle className="text-base">{item.name}</CardTitle></CardHeader><CardContent><div className="flex justify-between items-center text-sm text-muted-foreground"><Badge variant="outline" className="capitalize">{item.type}</Badge><span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span></div></CardContent></Card>))}</div></TabsContent>
        <TabsContent value="list" className="flex-1 mt-4 space-y-2">{graph.nodes.map(item => (<Card key={item.id}><CardContent className="p-3 flex items-center justify-between"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{format(new Date(item.createdAt), 'MMMM d, yyyy')}</p></div><div className="flex items-center gap-4"><Badge variant="outline" className="capitalize">{item.type}</Badge><Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="capitalize">{item.status}</Badge><MoreHorizontal className="text-muted-foreground" /></div></CardContent></Card>))}</TabsContent>
        <TabsContent value="kanban" className="flex-1 mt-4 overflow-x-auto"><DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}><div className="flex gap-6">{Object.values(kanbanColumns).map(col => (<KanbanColumnComponent key={col.id} column={col} />))}</div><DragOverlay>{activeTask ? <StaticTaskCard item={activeTask} /> : null}</DragOverlay></DndContext></TabsContent>
      </Tabs>
      <AlertDialog open={!!nodeToDelete} onOpenChange={(isOpen) => !isOpen && setNodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the node and its connections.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}