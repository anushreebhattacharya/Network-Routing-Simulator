import { BaseEdge, EdgeLabelRenderer, getStraightPath } from '@xyflow/react';

export default function CostEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}) {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const onPath = Boolean(data?.onPath);
  const stroke = onPath ? '#22d3ee' : selected ? '#67e8f9' : '#64748b';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth: onPath ? 3.5 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={`nodrag nopan absolute rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${
            onPath
              ? 'border-cyan-300 bg-cyan-300 text-navy-950'
              : 'border-slate-600 bg-navy-800 text-cyan-100'
          }`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          {data?.weight ?? 1}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
