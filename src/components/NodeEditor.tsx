import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/stores/useAppStore';
import type { KnowledgeNode } from '@/types/knowledge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, X, Link as LinkIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
const nodeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  type: z.enum(['article', 'guide', 'template', 'code', 'collection', 'topic']),
  status: z.enum(['published', 'draft', 'in_progress', 'idea', 'backlog', 'done']),
  keywords: z.string(),
  content: z.string().optional(),
});
type NodeFormData = z.infer<typeof nodeSchema>;
interface NodeEditorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nodeToEdit?: KnowledgeNode | null;
}
export function NodeEditor({ isOpen, onOpenChange, nodeToEdit }: NodeEditorProps) {
  const { createNode, updateNode, graph, createLink, deleteLink } = useAppStore(state => ({
    createNode: state.createNode,
    updateNode: state.updateNode,
    graph: state.graph,
    createLink: state.createLink,
    deleteLink: state.deleteLink,
  }));
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<NodeFormData>({
    resolver: zodResolver(nodeSchema),
  });
  const [linkTarget, setLinkTarget] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const linkedNodes = useMemo(() => {
    if (!nodeToEdit) return [];
    const linkedIds = new Set(graph.links
      .filter(l => l.source === nodeToEdit.id || l.target === nodeToEdit.id)
      .map(l => l.source === nodeToEdit.id ? l.target : l.source)
    );
    return graph.nodes.filter(n => linkedIds.has(n.id));
  }, [graph, nodeToEdit]);
  const availableNodes = useMemo(() => {
    if (!nodeToEdit) return [];
    const linkedIds = new Set(linkedNodes.map(n => n.id));
    return graph.nodes.filter(n => n.id !== nodeToEdit.id && !linkedIds.has(n.id));
  }, [graph.nodes, linkedNodes, nodeToEdit]);
  useEffect(() => {
    if (nodeToEdit) {
      reset({
        name: nodeToEdit.name,
        type: nodeToEdit.type,
        status: nodeToEdit.status,
        keywords: nodeToEdit.keywords.join(', '),
        content: nodeToEdit.content || '',
      });
    } else {
      reset({
        name: '',
        type: 'article',
        status: 'idea',
        keywords: '',
        content: '',
      });
    }
  }, [nodeToEdit, reset, isOpen]);
  const onSubmit = (data: NodeFormData) => {
    const keywordsArray = data.keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (nodeToEdit) {
      updateNode({
        ...nodeToEdit,
        ...data,
        keywords: keywordsArray,
      });
    } else {
      const newNode: KnowledgeNode = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        val: 5,
        ...data,
        keywords: keywordsArray,
      };
      createNode(newNode);
    }
    onOpenChange(false);
  };
  const handleAddLink = () => {
    if (nodeToEdit && linkTarget) {
      createLink({ source: nodeToEdit.id, target: linkTarget });
      setLinkTarget('');
    }
  };
  const handleRemoveLink = (targetId: string) => {
    if (nodeToEdit) {
      deleteLink(nodeToEdit.id, targetId);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{nodeToEdit ? 'Edit Node' : 'Create New Node'}</DialogTitle>
          <DialogDescription>
            {nodeToEdit ? 'Update the details of your knowledge node.' : 'Capture a new piece of knowledge to add to your graph.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="pr-6">
            <form onSubmit={handleSubmit(onSubmit)} id="node-editor-form" className="grid gap-4 py-4">
              {/* Form fields */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <div className="col-span-3">
                  <Input id="name" {...register('name')} className="w-full" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Controller name="type" control={control} defaultValue="article" render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="topic">Topic</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Controller name="status" control={control} defaultValue="idea" render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keywords" className="text-right">Keywords</Label>
                <div className="col-span-3">
                  <Input id="keywords" {...register('keywords')} placeholder="comma, separated, values" className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">Separate keywords with a comma.</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">Content</Label>
                <Textarea id="content" {...register('content')} className="col-span-3" rows={5} />
              </div>
            </form>
            {/* Link Management */}
            {nodeToEdit && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Manage Links</h3>
                </div>
                <div className="space-y-2">
                  {linkedNodes.map(node => (
                    <div key={node.id} className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                      <span>{node.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveLink(node.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={popoverOpen} className="w-full justify-between">
                        {linkTarget ? availableNodes.find(n => n.id === linkTarget)?.name : "Select node to link..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search nodes..." />
                        <CommandEmpty>No nodes found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {availableNodes.map(node => (
                              <CommandItem key={node.id} value={node.id} onSelect={(currentValue) => {
                                setLinkTarget(currentValue === linkTarget ? '' : currentValue);
                                setPopoverOpen(false);
                              }}>
                                {node.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button onClick={handleAddLink} disabled={!linkTarget}>Add Link</Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="node-editor-form">{nodeToEdit ? 'Save Changes' : 'Create Node'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}