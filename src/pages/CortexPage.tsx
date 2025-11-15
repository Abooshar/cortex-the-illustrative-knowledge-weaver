import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Table, KanbanSquare, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cortexContent } from '@/lib/mock-data';
import { format } from 'date-fns';
type ViewMode = 'table' | 'grid' | 'list' | 'kanban';
export function CortexPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
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
            <h1 className="text-2xl font-display font-bold text-foreground">
              Content Cortex
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize and manage all your knowledge items.
            </p>
          </div>
        </div>
      </motion.div>
      <Tabs defaultValue="table" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="table"><Table className="w-4 h-4 mr-2" />Table</TabsTrigger>
          <TabsTrigger value="grid" disabled><LayoutGrid className="w-4 h-4 mr-2" />Grid</TabsTrigger>
          <TabsTrigger value="list" disabled><List className="w-4 h-4 mr-2" />List</TabsTrigger>
          <TabsTrigger value="kanban" disabled><KanbanSquare className="w-4 h-4 mr-2" />Kanban</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="flex-1 mt-4">
          <Card className="h-full border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="font-sans font-semibold">All Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ShadcnTable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Keywords</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cortexContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          style={{
                            backgroundColor: item.status === 'published' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                            color: item.status === 'published' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))',
                          }}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(item.createdAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="space-x-1">
                        {item.keywords.map(keyword => (
                          <Badge key={keyword} variant="secondary">{keyword}</Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ShadcnTable>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}