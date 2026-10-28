export default function ComparisonPanel({ comparison }) {
  if (!comparison) {
    return (
      <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4 text-sm text-slate-500">
        Compare Dijkstra, Bellman–Ford and BFS on the same topology to discuss trade-offs in a viva.
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
      <h2 className="text-sm font-semibold text-white">Algorithm comparison</h2>
      <p className="mb-3 text-[11px] leading-relaxed text-amber-200/90">{comparison.timingDisclaimer}</p>
      <div className="panel-scroll overflow-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="py-1 pr-2">Algorithm</th>
              <th className="py-1 pr-2">Status</th>
              <th className="py-1 pr-2">Path</th>
              <th className="py-1 pr-2">Cost</th>
              <th className="py-1 pr-2">Hops</th>
              <th className="py-1 pr-2">Visited</th>
              <th className="py-1">Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {comparison.results.map((row) => (
              <tr key={row.algorithm} className="border-t border-white/5">
                <td className="py-1.5 pr-2 font-medium text-white">{row.algorithm}</td>
                <td className="py-1.5 pr-2">{row.status}</td>
                <td className="py-1.5 pr-2">{row.path?.length ? row.path.join(' → ') : '—'}</td>
                <td className="py-1.5 pr-2">{row.totalCost ?? '—'}</td>
                <td className="py-1.5 pr-2">{row.hopCount ?? '—'}</td>
                <td className="py-1.5 pr-2">{row.visitedCount}</td>
                <td className="py-1.5">{Number(row.executionTimeMs).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
