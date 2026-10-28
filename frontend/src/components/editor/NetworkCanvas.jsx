import { useCallback, useMemo } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RouterNode from './RouterNode.jsx';
import CostEdge from './CostEdge.jsx';
import PacketOverlay from './PacketOverlay.jsx';
import { canConnect, topologyToFlow } from '../../utils/graph.js';

const nodeTypes = { router: RouterNode };
const edgeTypes = { cost: CostEdge };

function CanvasInner({
  nodes,
  edges,
  visual,
  onMoveRouter,
  onConnectLink,
  onSelectEdge,
  onSelectNode,
  packet,
}) {
  const { flowNodes, flowEdges } = useMemo(
    () => topologyToFlow(nodes, edges, visual),
    [nodes, edges, visual],
  );

  const onNodesChange = useCallback(
    (changes) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position && change.id) {
          onMoveRouter(change.id, change.position);
        }
      }
    },
    [onMoveRouter],
  );

  const onConnect = useCallback(
    (connection) => {
      const check = canConnect(nodes, edges, connection.source, connection.target);
      if (!check.ok) {
        onConnectLink(null, check.reason);
        return;
      }
      onConnectLink(connection);
    },
    [nodes, edges, onConnectLink],
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#08101f]">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onEdgeClick={(_, edge) => onSelectEdge?.(edge.id)}
        onNodeClick={(_, node) => onSelectNode?.(node.id)}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'cost' }}
        connectionLineStyle={{ stroke: '#22d3ee', strokeWidth: 2 }}
      >
        <Background color="#1e3a5f" gap={22} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(7,11,22,0.7)"
          nodeColor="#22d3ee"
          className="!bg-navy-900 !border-cyan-400/20"
        />
        <Controls className="!border-cyan-400/20 !bg-navy-900 !fill-cyan-100" />
        <PacketOverlay
          path={packet?.path}
          progress={packet?.progress ?? 0}
          visible={Boolean(packet?.visible)}
        />
      </ReactFlow>
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-cyan-400/20 bg-navy-900/80 px-6 py-4 text-center text-sm text-slate-300">
            Empty canvas. Use <span className="text-cyan-300">Add Router</span> or
            <span className="text-cyan-300"> Load Demo Network</span> to begin.
          </div>
        </div>
      )}
    </div>
  );
}

export default function NetworkCanvas(props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
