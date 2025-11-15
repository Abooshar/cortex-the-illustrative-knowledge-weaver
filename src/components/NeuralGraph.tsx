import React, { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { useTheme } from '@/components/ThemeProvider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}
interface NeuralGraphProps {
  data: GraphData;
}
export const NeuralGraph: React.FC<NeuralGraphProps> = ({ data }) => {
  const fgRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timer = setTimeout(() => fgRef.current?.zoomToFit(400, 100), 500);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);
  const handleNodeClick = useCallback((node: NodeObject) => {
    if (node) {
      const newHighlightNodes = new Set();
      const newHighlightLinks = new Set();
      newHighlightNodes.add(node);
      data.links.forEach(link => {
        if (link.source === node || link.target === node) {
          newHighlightLinks.add(link);
          newHighlightNodes.add(link.source);
          newHighlightNodes.add(link.target);
        }
      });
      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
      setSelectedNode(node);
    }
  }, [data.links]);
  const handleBackgroundClick = useCallback(() => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setSelectedNode(null);
  }, []);
  if (typeof window === 'undefined') {
    return null;
  }
  return (
    <div ref={containerRef} className="w-full h-full absolute top-0 left-0">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel="id"
        nodeVal={node => (node.val as number) || 1}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;
          ctx.font = `600 ${fontSize}px Inter`;
          const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node);
          const isPrimary = node.group === 1;
          let nodeColor = isPrimary ? 'rgb(79, 70, 229)' : (isDark ? 'rgba(250, 250, 252, 0.8)' : 'rgba(23, 23, 33, 0.8)');
          if (selectedNode === node) {
            nodeColor = isDark ? '#f59e0b' : '#d97706'; // Amber color for selected
          }
          ctx.globalAlpha = isHighlighted ? 1 : 0.2;
          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, (node.val as number) * 4, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isPrimary ? (isDark ? '#fafafc' : '#171721') : (isDark ? '#fafafc' : '#171721');
          ctx.fillText(label, node.x!, node.y!);
          ctx.globalAlpha = 1;
        }}
        linkWidth={link => (highlightLinks.has(link) ? 2 : 0.5)}
        linkColor={link => (highlightLinks.has(link) ? (isDark ? '#f59e0b' : '#d97706') : (isDark ? 'rgba(250, 250, 252, 0.2)' : 'rgba(23, 23, 33, 0.2)'))}
        linkDirectionalParticles={link => (highlightLinks.has(link) ? 4 : 0)}
        linkDirectionalParticleWidth={2}
        backgroundColor={isDark ? 'rgb(23, 23, 33)' : 'rgb(250, 250, 252)'}
      />
      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">{selectedNode?.id as string}</SheetTitle>
            <SheetDescription>
              Details and connections for this knowledge node.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p><strong>Group:</strong> {selectedNode?.group}</p>
            <p><strong>Value:</strong> {selectedNode?.val as number}</p>
            <h3 className="font-semibold mt-4">Connections:</h3>
            <ul>
              {data.links
                .filter(link => link.source === selectedNode || link.target === selectedNode)
                .map((link, i) => {
                  const connectedNode = (link.source as NodeObject).id === selectedNode?.id ? (link.target as NodeObject).id : (link.source as NodeObject).id;
                  return <li key={i}>- {connectedNode as string}</li>;
                })}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};