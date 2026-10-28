import { Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';

export default function EditorToolbar({
  onAddRouter,
  onReset,
  onLoadDemo,
  selectedEdge,
  onUpdateWeight,
  onDeleteEdge,
  selectedNode,
  onDeleteNode,
  notice,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan-400/15 bg-navy-900/80 p-3">
      <button type="button" onClick={onAddRouter} className="btn-primary">
        <Plus size={14} /> Add Router
      </button>
      <button type="button" onClick={onLoadDemo} className="btn-secondary">
        <Sparkles size={14} /> Load Demo Network
      </button>
      <button type="button" onClick={onReset} className="btn-ghost">
        <RotateCcw size={14} /> Reset
      </button>
      {selectedNode && (
        <button type="button" onClick={() => onDeleteNode(selectedNode)} className="btn-danger">
          <Trash2 size={14} /> Delete {selectedNode}
        </button>
      )}
      {selectedEdge && (
        <label className="ml-2 flex items-center gap-2 text-xs text-slate-300">
          Link cost
          <input
            type="number"
            step="1"
            value={selectedEdge.weight}
            onChange={(e) => onUpdateWeight(selectedEdge.id, e.target.value)}
            className="input-compact w-20"
          />
          <button type="button" className="btn-danger" onClick={() => onDeleteEdge(selectedEdge.id)}>
            Remove link
          </button>
        </label>
      )}
      {notice && <span className="text-xs text-amber-300">{notice}</span>}
    </div>
  );
}
