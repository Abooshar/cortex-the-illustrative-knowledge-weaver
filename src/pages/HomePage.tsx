import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import NeuralGraph from '@/components/NeuralGraph';
import { graphData } from '@/lib/mock-data';
export function NeuralPage() {
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
        <NeuralGraph data={graphData} />
      </main>
    </div>
  );
}