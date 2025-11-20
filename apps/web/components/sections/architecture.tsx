"use client";

import React, { useCallback } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  Position,
  MarkerType
} from "react-flow-renderer";
import { SectionWrapper } from "../ui/section-wrapper";

const initialNodes = [
  { 
    id: '1', 
    type: 'input', 
    data: { label: 'Turborepo Root' }, 
    position: { x: 250, y: 0 },
    style: { background: '#2C3E50', color: '#fff', border: '1px solid #4ECDC4' }
  },
  { 
    id: '2', 
    data: { label: 'apps/web (Next.js)' }, 
    position: { x: 100, y: 100 },
    style: { background: '#2C3E50', color: '#fff', border: '1px solid #FF6B6B' }
  },
  { 
    id: '3', 
    data: { label: 'apps/server (Express)' }, 
    position: { x: 400, y: 100 },
    style: { background: '#2C3E50', color: '#fff', border: '1px solid #FF6B6B' }
  },
  { 
    id: '4', 
    data: { label: 'packages/ui' }, 
    position: { x: 0, y: 200 },
    style: { background: '#2C3E50', color: '#fff', border: '1px solid #96CEB4' }
  },
  { 
    id: '5', 
    data: { label: 'packages/db (Prisma)' }, 
    position: { x: 200, y: 200 },
    style: { background: '#2C3E50', color: '#fff', border: '1px solid #96CEB4' }
  },
  { 
    id: '6', 
    data: { label: 'packages/trpc' }, 
    position: { x: 400, y: 200 },
    style: { background: '#2C3E50', color: '#fff', border: '1px solid #96CEB4' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#fff' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e2-5', source: '2', target: '5', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e2-6', source: '2', target: '6', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#4ECDC4' } },
];

export const Architecture = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <SectionWrapper id="architecture">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Monorepo Architecture
        </h2>
        <p className="text-lg text-neutral-400">
          Visualize how the apps and packages connect in this scalable structure.
        </p>
      </div>

      <div className="h-[500px] w-full rounded-2xl border border-white/10 bg-neutral-900/50 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#4ECDC4" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </SectionWrapper>
  );
};
