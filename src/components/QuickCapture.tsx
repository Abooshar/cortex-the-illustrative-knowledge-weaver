import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/useAppStore';
export function QuickCapture() {
  const setEditingNode = useAppStore(state => state.setEditingNode);
  const setIsEditorOpen = useAppStore(state => state.setIsEditorOpen);
  const handleOpen = () => {
    setEditingNode(null);
    setIsEditorOpen(true);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={handleOpen}
              className="rounded-full w-14 h-14 bg-gradient-to-br from-cortex-primary to-purple-500 text-white shadow-lg hover:scale-110 transition-transform duration-200"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Quick Capture</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}