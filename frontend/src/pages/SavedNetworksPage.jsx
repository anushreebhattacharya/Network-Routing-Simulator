import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTopology, listTopologies, seedDemo } from '../api/client.js';

export default function SavedNetworksPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTopologies();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSeed = async () => {
    try {
      await seedDemo();
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTopology(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Saved topologies</h2>
          <p className="text-sm text-slate-400">Stored in local MongoDB. Load a record back into the simulator from this list after opening the Simulator and using Load Demo, or re-save from the canvas.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={handleSeed}>Seed campus demo</button>
          <button type="button" className="btn-ghost" onClick={refresh}>Refresh</button>
        </div>
      </div>
      {loading && <p className="text-slate-400">Loading saved networks…</p>}
      {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-slate-400">No saved topologies yet. Run Seed campus demo or save from the simulator.</p>
      )}
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400">{item.description || 'No description'}</p>
                <p className="mt-1 text-xs text-cyan-200">
                  {item.nodes.length} routers · {item.edges.length} links
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    sessionStorage.setItem('nrs:loadTopology', JSON.stringify(item));
                    navigate('/');
                  }}
                >
                  Load
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
