import { ALGORITHM_META } from '../../utils/graph.js';

export default function AlgorithmPanel({
  algorithm,
  onAlgorithm,
  source,
  destination,
  routers,
  onSource,
  onDestination,
  onRun,
  onCompare,
  running,
}) {
  return (
    <section className="space-y-3 rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
      <h2 className="text-sm font-semibold text-white">Routing algorithm</h2>
      <div className="grid gap-2">
        {Object.values(ALGORITHM_META).map((item) => (
          <label
            key={item.id}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              algorithm === item.id
                ? 'border-cyan-300 bg-cyan-400/10'
                : 'border-white/10 hover:border-cyan-400/30'
            }`}
          >
            <input
              type="radio"
              className="mr-2 accent-cyan-400"
              checked={algorithm === item.id}
              onChange={() => onAlgorithm(item.id)}
            />
            <span className="font-medium">{item.name}</span>
            <p className="mt-1 text-xs text-slate-400">{item.summary}</p>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-400">
          Source
          <select className="input-compact mt-1 w-full" value={source} onChange={(e) => onSource(e.target.value)}>
            <option value="">Select</option>
            {routers.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-400">
          Destination
          <select className="input-compact mt-1 w-full" value={destination} onChange={(e) => onDestination(e.target.value)}>
            <option value="">Select</option>
            {routers.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn-primary justify-center" disabled={running} onClick={onRun}>
          {running ? 'Running…' : 'Find route'}
        </button>
        <button type="button" className="btn-secondary justify-center" disabled={running} onClick={onCompare}>
          Compare all
        </button>
      </div>
    </section>
  );
}
