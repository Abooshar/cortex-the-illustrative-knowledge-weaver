import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/useAppStore';
import type { KnowledgeNode, NodeType, NodeStatus } from '@/types/knowledge';
const nodeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  type: z.enum(['article', 'guide', 'template', 'code', 'collection', 'topic']),
  status: z.enum(['published', 'draft', 'in_progress', 'idea', 'backlog', 'done']),
  keywords: z.string().transform(val => val.split(',').map(k => k.trim()).filter(Boolean)),
  content: z.string().optional(),
});
type NodeFormData = z.infer<typeof nodeSchema>;
interface NodeEditorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nodeToEdit?: KnowledgeNode | null;
}
export function NodeEditor({ isOpen, onOpenChange, nodeToEdit }: NodeEditorProps) {
  const { createNode, updateNode } = useAppStore(state => ({
    createNode: state.createNode,
    updateNode: state.updateNode,
  }));
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<NodeFormData>({
    resolver: zodResolver(nodeSchema),
  });
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
    if (nodeToEdit) {
      updateNode({
        ...nodeToEdit,
        ...data,
      });
    } else {
      const newNode: KnowledgeNode = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        val: 5, // Default value for new nodes
        ...data,
      };
      createNode(newNode);
    }
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{nodeToEdit ? 'Edit Node' : 'Create New Node'}</DialogTitle>
          <DialogDescription>
            {nodeToEdit ? 'Update the details of your knowledge node.' : 'Capture a new piece of knowledge to add to your graph.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} id="node-editor-form" className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input id="name" {...register('name')} className="w-full" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Controller
              name="type"
              control={control}
              defaultValue="article"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                    <SelectItem value="topic">Topic</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Controller
              name="status"
              control={control}
              defaultValue="idea"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="node-editor-form">{nodeToEdit ? 'Save Changes' : 'Create Node'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}