function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-navy-800 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

export default function MetricsPanel({ result, error, loading }) {
  if (loading) {
    return (
      <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4 text-sm text-slate-300">
        Computing shortest path on the server…
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">
        {error}
      </section>
    );
  }

  if (!result) {
    return (
      <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4 text-sm text-slate-400">
        Run an algorithm to see path cost, hops, visited routers and execution time.
      </section>
    );
  }

  const failed = result.status !== 'ok';

  return (
    <section className="space-y-3 rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Simulation result</h2>
        <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${failed ? 'bg-rose-500/20 text-rose-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
          {result.status.replaceAll('_', ' ')}
        </span>
      </div>
      <p className="text-xs text-slate-300">{result.message}</p>
      {failed ? (
        <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
          No usable route for visualization. Adjust links or choose another algorithm.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Path" value={result.path.join(' → ')} />
          <Metric label="Total cost" value={result.totalCost} />
          <Metric label="Hops" value={result.hopCount} />
          <Metric label="Visited" value={result.visitedRouters.length} />
          <Metric label="Time (ms)" value={Number(result.executionTimeMs).toFixed(3)} />
          <Metric label="Connected?" value={result.networkConnected ? 'Yes' : 'No'} />
        </div>
      )}
      {result.visitedRouters?.length > 0 && (
        <p className="text-[11px] text-slate-400">
          Visit order: {result.visitedRouters.join(' → ')}
        </p>
      )}
    </section>
  );
}
