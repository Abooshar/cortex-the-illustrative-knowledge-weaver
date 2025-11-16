import React, { useState, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Popover, Card, CardContent, Typography } from '@mui/material';

// Sample data based on context
const sampleNodes = [
  { id: 'AI', name: 'Artificial Intelligence', val: 10 },
  { id: 'Machine Learning', name: 'Machine Learning', val: 8 },
  { id: 'Programming', name: 'Programming', val: 10 },
  { id: 'Design', name: 'Design', val: 9 },
  { id: 'Deep Learning', name: 'Deep Learning', val: 6 },
  { id: 'NLP', name: 'Natural Language Processing', val: 6 },
  { id: 'Computer Vision', name: 'Computer Vision', val: 6 },
  { id: 'Python', name: 'Python', val: 8 },
  { id: 'JavaScript', name: 'JavaScript', val: 8 },
  { id: 'React', name: 'React', val: 6 },
  { id: 'UX Research', name: 'UX Research', val: 7 },
  { id: 'UI Design', name: 'UI Design', val: 7 },
  { id: 'Data Science', name: 'Data Science', val: 8 },
  { id: 'Cloud Architecture', name: 'Cloud Architecture', val: 7 },
];

const sampleLinks = [
  { source: 'AI', target: 'Machine Learning' },
  { source: 'AI', target: 'Data Science' },
  { source: 'Machine Learning', target: 'Deep Learning' },
  { source: 'Machine Learning', target: 'NLP' },
  { source: 'Machine Learning', target: 'Computer Vision' },
  { source: 'Programming', target: 'Python' },
  { source: 'Programming', target: 'JavaScript' },
  { source: 'Programming', target: 'Cloud Architecture' },
  { source: 'JavaScript', target: 'React' },
  { source: 'Design', target: 'UX Research' },
  { source: 'Design', target: 'UI Design' },
  { source: 'Data Science', target: 'Python' },
  { source: 'Data Science', target: 'Machine Learning' },
];

const NeuralGraph: React.FC = () => {
  const [graphData] = useState({ nodes: sampleNodes, links: sampleLinks });
  const [highlightNodes, setHighlightNodes] = useState<Set<string | number>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<any>>(new Set());
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updateHighlight = useCallback((node: any | null) => {
    const newHighlightNodes = new Set<string | number>();
    const newHighlightLinks = new Set<any>();

    if (node) {
      newHighlightNodes.add(node.id as string);
      graphData.links.forEach(link => {
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
  }, [graphData.links]);

  const handleNodeClick = useCallback((node: any, event: MouseEvent) => {
    setSelectedNode(node);
    // Use a dummy div for popover positioning
    const popoverAnchor = document.createElement('div');
    popoverAnchor.style.position = 'fixed';
    popoverAnchor.style.top = `${event.clientY}px`;
    popoverAnchor.style.left = `${event.clientX}px`;
    document.body.appendChild(popoverAnchor);
    setAnchorEl(popoverAnchor);
    updateHighlight(node);
  }, [updateHighlight]);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setAnchorEl(null);
    updateHighlight(null);
  }, [updateHighlight]);

  const handlePopoverClose = () => {
    if (anchorEl) {
      document.body.removeChild(anchorEl);
    }
    setAnchorEl(null);
  };

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name as string;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    
    const isHighlighted = highlightNodes.has(node.id as string);
    const isSelected = selectedNode?.id === node.id;

    ctx.fillStyle = isSelected ? 'rgba(255, 255, 0, 0.9)' : isHighlighted ? 'rgba(255, 165, 0, 0.8)' : 'rgba(0, 191, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, (node.val as number) / 2, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(label, node.x!, node.y! + (node.val as number) / 2 + fontSize);
  }, [highlightNodes, selectedNode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeVal="val"
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        linkWidth={link => highlightLinks.has(link) ? 2 : 1}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkDirectionalParticles={link => highlightLinks.has(link) ? 4 : 0}
        linkDirectionalParticleWidth={2}
        nodeCanvasObject={nodeCanvasObject}
        backgroundColor="#000011"
      />
      <Popover
        id={selectedNode ? 'node-details-popover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        ref={popoverRef}
      >
        {selectedNode && (
          <Card sx={{ minWidth: 275, maxWidth: 350 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {selectedNode.name as string}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                ID: {selectedNode.id as string}
              </Typography>
              <Typography variant="body2">
                This is a sample detail card for the selected node. More information about "{selectedNode.name as string}" would be displayed here.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Popover>
    </div>
  );
};

export default NeuralGraph;