import { useEffect, useMemo, useRef, useState } from 'react';
import NetworkCanvas from '../components/editor/NetworkCanvas.jsx';
import EditorToolbar from '../components/controls/EditorToolbar.jsx';
import AlgorithmPanel from '../components/controls/AlgorithmPanel.jsx';
import PlaybackControls from '../components/simulation/PlaybackControls.jsx';
import MetricsPanel from '../components/simulation/MetricsPanel.jsx';
import RoutingTable from '../components/tables/RoutingTable.jsx';
import ComparisonPanel from '../components/comparison/ComparisonPanel.jsx';
import { useNetwork } from '../hooks/useNetwork.js';
import { compareAlgorithms, fetchDemo, runAlgorithm, saveTopology } from '../api/client.js';

export default function SimulatorPage() {
  const network = useNetwork();
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState('');
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState('My Topology');
  const [saveMessage, setSaveMessage] = useState('');

  const [packetProgress, setPacketProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef(null);
  const progressRef = useRef(0);

  const routers = network.nodes.map((n) => n.id);
  const selectedEdge = network.edges.find((e) => e.id === selectedEdgeId) || null;
  const hasPath = result?.status === 'ok' && result.path?.length > 1;

  const visual = useMemo(
    () => ({
      path: result?.path || [],
      visited: result?.visitedRouters || [],
      source,
      destination,
      noRoute: result ? result.status === 'no_route' : false,
    }),
    [result, source, destination],
  );

  useEffect(() => {
    const raw = sessionStorage.getItem('nrs:loadTopology');
    if (!raw) return undefined;
    sessionStorage.removeItem('nrs:loadTopology');
    try {
      const parsed = JSON.parse(raw);
      network.load(parsed);
      setSource(parsed.defaultSource || parsed.nodes?.[0]?.id || '');
      setDestination(parsed.defaultDestination || '');
    } catch {
      setError('Could not load the saved topology.');
    }
    return undefined;
    // Load a topology handed over from the Saved Networks page once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    progressRef.current = packetProgress;
  }, [packetProgress]);

  useEffect(() => {
    if (!playing || !hasPath) return undefined;
    const duration = Math.max(1800, result.path.length * 700);
    const origin = progressRef.current;
    const started = performance.now();
    const tick = (now) => {
      const t = Math.min(1, origin + ((now - started) / duration) * (1 - origin));
      progressRef.current = t;
      setPacketProgress(t);
      if (t >= 1) {
        setPlaying(false);
        return;
      }
      playRef.current = requestAnimationFrame(tick);
    };
    playRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(playRef.current);
  }, [playing, hasPath, result]);

  const stopPlayback = () => {
    setPlaying(false);
    if (playRef.current) cancelAnimationFrame(playRef.current);
  };

  const payload = () => ({
    algorithm,
    nodes: network.nodes,
    edges: network.edges,
    source,
    destination,
  });

  const handleRun = async () => {
    stopPlayback();
    setPacketProgress(0);
    setLoading(true);
    setError(null);
    try {
      const data = await runAlgorithm(payload());
      setResult(data);
      setComparison(null);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    stopPlayback();
    setLoading(true);
    setError(null);
    try {
      const data = await compareAlgorithms({
        nodes: network.nodes,
        edges: network.edges,
        source,
        destination,
      });
      setComparison(data);
      const primary = await runAlgorithm(payload());
      setResult(primary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setError(null);
    try {
      const demo = await fetchDemo();
      network.load(demo);
      setSource(demo.defaultSource || 'R1');
      setDestination(demo.defaultDestination || 'R8');
      setResult(null);
      setComparison(null);
      setPacketProgress(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    stopPlayback();
    network.reset();
    setSource('');
    setDestination('');
    setResult(null);
    setComparison(null);
    setSelectedEdgeId(null);
    setPacketProgress(0);
  };

  const handleConnect = (connection, reason) => {
    if (!connection) {
      network.setNotice(reason);
      return;
    }
    network.addLink(connection.source, connection.target, 1);
  };

  const handleSave = async () => {
    setSaveMessage('');
    try {
      await saveTopology({
        name: saveName,
        description: 'Saved from the simulator canvas',
        nodes: network.nodes,
        edges: network.edges,
        defaultSource: source,
        defaultDestination: destination,
      });
      setSaveMessage('Topology saved to MongoDB.');
    } catch (err) {
      setSaveMessage(err.message);
    }
  };

  const stepPacket = () => {
    if (!hasPath) return;
    const hops = result.path.length - 1;
    setPacketProgress((p) => Math.min(1, p + 1 / hops));
  };

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Interactive topology</h2>
          <p className="text-xs text-slate-400">
            {network.summary.routerCount} routers · {network.summary.linkCount} bidirectional links · drag handles to connect
          </p>
        </div>
        <PlaybackControls
          enabled={hasPath}
          playing={playing}
          onPlay={() => hasPath && setPlaying(true)}
          onPause={() => setPlaying(false)}
          onStep={stepPacket}
          onReset={() => {
            setPlaying(false);
            setPacketProgress(0);
          }}
        />
      </div>

      <EditorToolbar
        onAddRouter={() => network.addRouter()}
        onReset={handleReset}
        onLoadDemo={handleLoadDemo}
        selectedEdge={selectedEdge}
        onUpdateWeight={network.updateLinkWeight}
        onDeleteEdge={(id) => {
          network.deleteLink(id);
          setSelectedEdgeId(null);
        }}
        selectedNode={selectedNode}
        onDeleteNode={(id) => {
          network.deleteRouter(id);
          setSelectedNode('');
        }}
        notice={network.notice}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)_340px] gap-3">
        <div className="panel-scroll space-y-3 overflow-auto">
          <AlgorithmPanel
            algorithm={algorithm}
            onAlgorithm={setAlgorithm}
            source={source}
            destination={destination}
            routers={routers}
            onSource={setSource}
            onDestination={setDestination}
            onRun={handleRun}
            onCompare={handleCompare}
            running={loading}
          />
          <section className="space-y-2 rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
            <h2 className="text-sm font-semibold text-white">Edit selected router</h2>
            <select className="input-compact w-full" value={selectedNode} onChange={(e) => setSelectedNode(e.target.value)}>
              <option value="">None</option>
              {routers.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Drag a connection between router handles to create a bidirectional link. Click a cost badge, then edit it in the toolbar.
            </p>
          </section>
          <section className="space-y-2 rounded-xl border border-cyan-400/15 bg-navy-900 p-4">
            <h2 className="text-sm font-semibold text-white">Save topology</h2>
            <input className="input-compact w-full" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
            <button type="button" className="btn-secondary w-full justify-center" onClick={handleSave}>
              Save to MongoDB
            </button>
            {saveMessage && <p className="text-xs text-cyan-200">{saveMessage}</p>}
          </section>
        </div>

        <NetworkCanvas
          nodes={network.nodes}
          edges={network.edges}
          visual={visual}
          onMoveRouter={network.moveRouter}
          onConnectLink={handleConnect}
          onSelectEdge={setSelectedEdgeId}
          onSelectNode={setSelectedNode}
          packet={{
            path: result?.path || [],
            progress: packetProgress,
            visible: hasPath,
          }}
        />

        <div className="panel-scroll space-y-3 overflow-auto">
          <MetricsPanel result={result} error={error} loading={loading} />
          <RoutingTable rows={result?.routingTable} source={source} algorithm={algorithm} />
          <ComparisonPanel comparison={comparison} />
        </div>
      </div>
    </div>
  );
}
