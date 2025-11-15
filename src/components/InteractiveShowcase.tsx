import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenSquare, Sparkles, Share2, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
const tabs = [
  { id: 'connect', icon: LinkIcon, label: 'Connect Notes' },
  { id: 'ai', icon: Sparkles, label: 'AI Suggestions' },
  { id: 'visualize', icon: Share2, label: 'Visualize Graph' },
];
const showcaseContent = {
  connect: {
    title: 'Create effortless connections.',
    description: 'Link related notes with a simple @mention. Cortex automatically builds a relationship, turning your flat notes into a dynamic, networked knowledge base.',
    component: <ConnectDemo />,
  },
  ai: {
    title: 'Discover hidden insights.',
    description: 'Our AI assistant analyzes your content to suggest relevant connections you might have missed, helping you surface novel ideas and form a deeper understanding.',
    component: <AIDemo />,
  },
  visualize: {
    title: 'See the bigger picture.',
    description: 'Zoom out and see your entire knowledge base as an interactive neural map. Identify clusters of thought, discover outliers, and navigate your ideas visually.',
    component: <VisualizeDemo />,
  },
};
export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="flex space-x-2 p-1 bg-muted rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full relative rounded-md py-2.5 text-sm font-medium text-muted-foreground transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="showcase_bubble"
                  className="absolute inset-0 z-10 bg-background shadow-sm"
                  style={{ borderRadius: 6 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20 flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold font-sans">{showcaseContent[activeTab].title}</h3>
            <p className="text-muted-foreground">{showcaseContent[activeTab].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="h-[400px] bg-gradient-to-br from-cortex-primary/10 to-purple-500/10 rounded-xl p-4 border border-border/50 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {showcaseContent[activeTab].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
// Demo Components
function ConnectDemo() {
  return (
    <div className="w-full h-full bg-background rounded-lg p-6 shadow-inner flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <PenSquare className="w-5 h-5 text-cortex-primary" />
        <h4 className="font-semibold">Note: Cloudflare Architecture</h4>
      </div>
      <div className="flex-1 bg-muted rounded p-4 text-sm space-y-2 text-muted-foreground">
        <p>Cloudflare's architecture is built on a global anycast network...</p>
        <p>A key component is Workers, which allows for <span className="text-foreground font-medium">serverless</span> execution at the edge.</p>
        <p>This is related to my note on <motion.span initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }} className="bg-cortex-primary/20 text-cortex-primary px-1 py-0.5 rounded">@Serverless_Patterns</motion.span></p>
      </div>
    </div>
  );
}
function AIDemo() {
  return (
    <div className="w-full h-full bg-background rounded-lg p-6 shadow-inner flex flex-col relative overflow-hidden">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-muted/80 backdrop-blur-sm border-t"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-cortex-primary flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-semibold">AI Suggestion</h5>
            <p className="text-sm text-muted-foreground">This note seems related to <span className="font-medium text-foreground">"Edge Computing"</span>. Link it?</p>
          </div>
        </div>
      </motion.div>
      <div className="flex items-center gap-2 mb-4">
        <PenSquare className="w-5 h-5 text-muted-foreground" />
        <h4 className="font-semibold">Note: Vercel vs. Netlify</h4>
      </div>
      <div className="flex-1 bg-muted rounded p-4 text-sm space-y-2 text-muted-foreground">
        <p>Both platforms offer excellent developer experiences for deploying frontend applications...</p>
        <p>Vercel is tightly integrated with Next.js, while Netlify has a broader focus...</p>
      </div>
    </div>
  );
}
function VisualizeDemo() {
  const nodes = [
    { id: 'A', x: 30, y: 50 }, { id: 'B', x: 70, y: 20 },
    { id: 'C', x: 70, y: 80 }, { id: 'D', x: 110, y: 50 },
  ];
  return (
    <div className="w-full h-full bg-background rounded-lg p-6 shadow-inner flex items-center justify-center">
      <motion.svg viewBox="0 0 140 100" className="w-full h-full">
        <motion.line x1="30" y1="50" x2="70" y2="20" stroke="var(--border)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
        <motion.line x1="30" y1="50" x2="70" y2="80" stroke="var(--border)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
        <motion.line x1="70" y1="20" x2="110" y2="50" stroke="var(--border)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
        <motion.line x1="70" y1="80" x2="110" y2="50" stroke="var(--border)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.8 }} />
        {nodes.map((node, i) => (
          <motion.g key={node.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5, delay: i * 0.2 }}>
            <circle cx={node.x} cy={node.y} r="8" fill="hsl(var(--primary))" />
            <circle cx={node.x} cy={node.y} r="8" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.5">
              <animate attributeName="r" from="8" to="16" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}