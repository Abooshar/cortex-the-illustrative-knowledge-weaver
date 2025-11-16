import React, { useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { useAppStore } from '@/stores/useAppStore';
import type { KnowledgeNode } from '@/types/knowledge';
interface NeuralGraphProps {
  data: {
    nodes: KnowledgeNode[];
    links: { source: string; target: string }[];
  };
}
const NeuralGraph: React.FC<NeuralGraphProps> = ({ data }) => {
  const graphRef = useRef<ForceGraphMethods>();
  const setEditingNode = useAppStore(state => state.setEditingNode);
  const setIsEditorOpen = useAppStore(state => state.setIsEditorOpen);
  const [highlightNodes, setHighlightNodes] = useState<Set<string | number>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<any>>(new Set());
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('link')?.distance(link => 80);
      graphRef.current.d3Force('charge')?.strength(-150);
    }
  }, []);
  const updateHighlight = useCallback((node: NodeObject | null) => {
    const newHighlightNodes = new Set<string | number>();
    const newHighlightLinks = new Set<any>();
    if (node) {
      newHighlightNodes.add(node.id as string);
      data.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        if (sourceId === node.id || targetId === node.id) {
          newHighlightLinks.add(link);
          newHighlightNodes.add(sourceId as string);
          newHighlightNodes.add(targetId as string);
        }
      });
    }
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  }, [data.links]);
  const handleNodeClick = useCallback((node: NodeObject) => {
    const fullNode = data.nodes.find(n => n.id === node.id);
    if (fullNode) {
      setEditingNode(fullNode);
      setIsEditorOpen(true);
    }
    updateHighlight(node);
    graphRef.current?.centerAt(node.x, node.y, 1000);
    graphRef.current?.zoom(2, 1000);
  }, [data.nodes, setEditingNode, setIsEditorOpen, updateHighlight]);
  const handleBackgroundClick = useCallback(() => {
    updateHighlight(null);
  }, [updateHighlight]);
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name as string;
    const fontSize = 12 / globalScale;
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    const isHighlighted = highlightNodes.has(node.id as string);
    const nodeColor = isHighlighted ? 'rgb(79, 70, 229)' : 'rgba(79, 70, 229, 0.6)';
    const textColor = isHighlighted ? '#fafafc' : 'rgba(250, 250, 252, 0.8)';
    ctx.fillStyle = nodeColor;
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, node.val, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(label, node.x!, node.y!);
  }, [highlightNodes]);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        nodeLabel="name"
        nodeVal="val"
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        linkWidth={link => highlightLinks.has(link) ? 2.5 : 1}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkDirectionalParticles={link => highlightLinks.has(link) ? 2 : 0}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleColor={() => 'rgb(79, 70, 229)'}
        nodeCanvasObject={nodeCanvasObject}
        backgroundColor="rgb(23, 23, 33)"
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400)}
      />
    </div>
  );
};
export default NeuralGraph;