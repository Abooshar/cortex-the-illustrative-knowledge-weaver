import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { useTheme } from '@/hooks/use-theme';
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
    // Zoom to fit after initial render
    const timer = setTimeout(() => {
      fgRef.current?.zoomToFit(400, 100);
    }, 500);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
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
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter`;
          const isPrimary = node.group === 1;
          const nodeColor = isPrimary ? 'rgb(79, 70, 229)' : (isDark ? 'rgba(250, 250, 252, 0.8)' : 'rgba(23, 23, 33, 0.8)');
          const textColor = isPrimary ? (isDark ? '#fafafc' : '#171721') : (isDark ? '#fafafc' : '#171721');
          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, (node.val as number) * 4, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = textColor;
          ctx.fillText(label, node.x!, node.y!);
        }}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => isDark ? 'rgba(250, 250, 252, 0.6)' : 'rgba(23, 23, 33, 0.6)'}
        linkColor={() => isDark ? 'rgba(250, 250, 252, 0.2)' : 'rgba(23, 23, 33, 0.2)'}
        backgroundColor={isDark ? 'rgb(23, 23, 33)' : 'rgb(250, 250, 252)'}
      />
    </div>
  );
};