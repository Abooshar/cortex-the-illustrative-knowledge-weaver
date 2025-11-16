import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Loader } from 'lucide-react';
import NeuralGraph from '@/components/NeuralGraph';
import { useAppStore } from '@/stores/useAppStore';
export function NeuralPage() {
  const fetchGraph = useAppStore(state => state.fetchGraph);
  const graph = useAppStore(state => state.graph);
  const isLoading = useAppStore(state => state.isLoading);
  const error = useAppStore(state => state.error);
  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4"
        >
          <BrainCircuit className="w-8 h-8 text-cortex-primary" />
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Neural View
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualize the connections within your knowledge base.
            </p>
          </div>
        </motion.div>
      </header>
      <main className="flex-1 relative bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 animate-spin text-cortex-primary" />
              <p className="text-muted-foreground">Loading Knowledge Graph...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && graph.nodes.length > 0 && (
          <NeuralGraph data={graph} />
        )}
      </main>
    </div>
  );
}