export default function RoutingTable({ rows, source, algorithm }) {
  return (
    <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
      <h2 className="text-sm font-semibold text-white">Routing table</h2>
      <p className="mb-3 text-xs text-slate-400">
        From source <span className="text-cyan-300">{source || '—'}</span> using {algorithm || 'the selected algorithm'}.
      </p>
      {!rows?.length ? (
        <p className="text-sm text-slate-500">No table yet. Run a successful route computation.</p>
      ) : (
        <div className="panel-scroll max-h-56 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-navy-900 text-slate-400">
              <tr>
                <th className="py-1 pr-2">Destination</th>
                <th className="py-1 pr-2">Next hop</th>
                <th className="py-1 pr-2">Cost</th>
                <th className="py-1">Route</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.destination} className="border-t border-white/5">
                  <td className="py-1.5 pr-2 font-medium text-white">{row.destination}</td>
                  <td className="py-1.5 pr-2">{row.nextHop ?? '—'}</td>
                  <td className="py-1.5 pr-2">{row.pathCost ?? '—'}</td>
                  <td className="py-1.5 text-slate-300">{row.routeInfo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
