import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Table, KanbanSquare, FolderKanban, MoreHorizontal } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cortexContent } from '@/lib/mock-data';
import type { CortexItem } from '@/lib/mock-data';
import { format } from 'date-fns';
import { useCortexStore } from '@/stores/useCortexStore';
import type { KanbanColumn, KanbanColumnId } from '@/stores/useCortexStore';
const TaskCard = ({ item }: { item: CortexItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4 bg-background touch-none">
      <CardContent className="p-3">
        <p className="font-semibold text-sm mb-2">{item.title}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize text-xs">{item.type}</Badge>
          <span className="text-xs text-muted-foreground">{format(item.createdAt, 'MMM d')}</span>
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
          {column.items.map(item => <TaskCard key={item.id} item={item} />)}
        </SortableContext>
      </Card>
    </div>
  );
};
export function CortexPage() {
  const { kanbanColumns, moveTask } = useCortexStore(state => ({ kanbanColumns: state.kanbanColumns, moveTask: state.moveTask }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const overContainerId = over.data.current?.sortable.containerId as KanbanColumnId;
      moveTask(active.id as string, over.id as string, overContainerId);
    }
  };
  const activeTask = activeId ? cortexContent.find(item => item.id === activeId) : null;
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between gap-4 mb-6"
      >
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
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Keywords</TableHead></TableRow></TableHeader>
                <TableBody>
                  {cortexContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{item.type}</Badge></TableCell>
                      <TableCell><Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="capitalize">{item.status}</Badge></TableCell>
                      <TableCell>{format(item.createdAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="space-x-1">{item.keywords.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ShadcnTable>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid" className="flex-1 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cortexContent.map(item => (
              <Card key={item.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <Badge variant="outline" className="capitalize">{item.type}</Badge>
                    <span>{format(item.createdAt, 'MMM d, yyyy')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="flex-1 mt-4 space-y-2">
          {cortexContent.map(item => (
            <Card key={item.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{format(item.createdAt, 'MMMM d, yyyy')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="capitalize">{item.type}</Badge>
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="capitalize">{item.status}</Badge>
                  <MoreHorizontal className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="kanban" className="flex-1 mt-4 overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-6">
              {Object.values(kanbanColumns).map(col => (
                <KanbanColumnComponent key={col.id} column={col} />
              ))}
            </div>
            <DragOverlay>{activeTask ? <TaskCard item={activeTask} /> : null}</DragOverlay>
          </DndContext>
        </TabsContent>
      </Tabs>
    </div>
  );
}