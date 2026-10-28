import { useReactFlow, ViewportPortal } from '@xyflow/react';
import { interpolatePath } from '../../utils/graph.js';

const NODE_CENTER = 36;

export default function PacketOverlay({ path, progress, visible }) {
  const { getNode } = useReactFlow();
  if (!visible || !path?.length) return null;

  const points = path
    .map((id) => {
      const node = getNode(id);
      if (!node) return null;
      return { x: node.position.x + NODE_CENTER, y: node.position.y + NODE_CENTER };
    })
    .filter(Boolean);

  const point = interpolatePath(points, progress);
  if (!point) return null;

  return (
    <ViewportPortal>
      <div
        className="pointer-events-none absolute z-10 h-4 w-4 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85)]"
        style={{
          transform: `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`,
        }}
      >
        <div className="absolute inset-0 animate-ping rounded-full bg-cyan-300/70" />
      </div>
    </ViewportPortal>
  );
}
