import { Handle, Position } from '@xyflow/react';

const ROLE_STYLES = {
  idle: 'border-cyan-400/40 bg-navy-800 text-cyan-100',
  source: 'border-emerald-400 bg-emerald-500/20 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.45)]',
  destination: 'border-amber-300 bg-amber-400/20 text-amber-100 shadow-[0_0_18px_rgba(252,211,77,0.4)]',
  path: 'border-cyan-300 bg-cyan-400/20 text-white shadow-[0_0_18px_rgba(34,211,238,0.45)]',
  visited: 'border-indigo-300 bg-indigo-500/20 text-indigo-100',
  unreachable: 'border-rose-400 bg-rose-500/20 text-rose-100',
};

export default function RouterNode({ data }) {
  const style = ROLE_STYLES[data.role] || ROLE_STYLES.idle;
  return (
    <div className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 ${style}`}>
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-cyan-300" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-cyan-300" />
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-cyan-300" />
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-cyan-300" />
      <div className="text-center">
        <div className="text-sm font-semibold tracking-wide">{data.label}</div>
        <div className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Router</div>
      </div>
    </div>
  );
}
