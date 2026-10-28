export default function HelpPage() {
  return (
    <div className="panel-scroll h-full overflow-auto p-6">
      <h2 className="text-xl font-semibold">How to present this project</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-slate-300">
        <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
          <h3 className="font-semibold text-white">Suggested viva flow</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Click Load Demo Network to show the campus topology.</li>
            <li>Set source R1 and destination R8, run Dijkstra, then Play the packet.</li>
            <li>Compare all algorithms and explain hops vs weighted cost.</li>
            <li>Point to the routing table as what a router would install toward each destination.</li>
            <li>Save the topology to MongoDB, then list it on Saved Networks.</li>
          </ol>
        </section>
        <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
          <h3 className="font-semibold text-white">Algorithms</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong className="text-cyan-200">Dijkstra</strong> expands the cheapest tentative distance. Negative link costs are rejected.</li>
            <li><strong className="text-cyan-200">Bellman–Ford</strong> relaxes every edge |V|−1 times and then checks for a reachable negative cycle.</li>
            <li><strong className="text-cyan-200">BFS</strong> treats every link as one hop, so it reports a minimum-hop path. The displayed cost is still the sum of weights along that hop path.</li>
          </ul>
        </section>
        <section className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
          <h3 className="font-semibold text-white">Timing disclaimer</h3>
          <p>
            Millisecond timings come from <code>process.hrtime</code> on the machine that runs the API.
            They help compare implementations in this demo and are not a scientific benchmark of the algorithms.
          </p>
        </section>
      </div>
    </div>
  );
}
