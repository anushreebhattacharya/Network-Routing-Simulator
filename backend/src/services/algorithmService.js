import { ALGORITHM_IDS, runAlgorithmById } from '../algorithms/index.js';
import { AppError } from '../utils/AppError.js';
import {
  buildAdjacency,
  buildRoutingTable,
  isConnectedUndirected,
  normalizeTopology,
  validateEndpoints,
} from './graphService.js';

export function executeAlgorithm({ algorithm, nodes, edges, source, destination }) {
  if (!ALGORITHM_IDS.includes(algorithm)) {
    throw new AppError(
      `Unsupported algorithm "${algorithm}". Use dijkstra, bellman-ford, or bfs.`,
      400,
      'UNSUPPORTED_ALGORITHM',
    );
  }

  const topology = normalizeTopology(nodes, edges);
  const { sourceId, destId } = validateEndpoints(topology.nodes, source, destination);
  const adjacency = buildAdjacency(topology);
  const connected = isConnectedUndirected(topology);
  const result = runAlgorithmById(algorithm, adjacency, sourceId, destId);
  const routingTable = result.status === 'negative_weight_rejected' || result.status === 'negative_cycle'
    ? []
    : buildRoutingTable(adjacency, sourceId, (adj, s, d) => runAlgorithmById(algorithm, adj, s, d));

  return {
    ...result,
    source: sourceId,
    destination: destId,
    networkConnected: connected,
    routingTable,
  };
}

export function compareAlgorithms({ nodes, edges, source, destination, algorithms }) {
  const selected = Array.isArray(algorithms) && algorithms.length
    ? algorithms
    : ALGORITHM_IDS;

  const unique = [...new Set(selected)];
  for (const id of unique) {
    if (!ALGORITHM_IDS.includes(id)) {
      throw new AppError(`Unsupported algorithm "${id}".`, 400, 'UNSUPPORTED_ALGORITHM');
    }
  }

  const topology = normalizeTopology(nodes, edges);
  const { sourceId, destId } = validateEndpoints(topology.nodes, source, destination);
  const results = unique.map((algorithm) =>
    executeAlgorithm({
      algorithm,
      nodes: topology.nodes,
      edges: topology.edges,
      source: sourceId,
      destination: destId,
    }),
  );

  return {
    source: sourceId,
    destination: destId,
    timingDisclaimer:
      'Execution times are measured on this machine and are informational only. They are not a definitive performance benchmark.',
    results: results.map((r) => ({
      algorithm: r.algorithm,
      status: r.status,
      message: r.message,
      path: r.path,
      totalCost: r.totalCost,
      hopCount: r.hopCount,
      visitedRouters: r.visitedRouters,
      visitedCount: r.visitedRouters.length,
      executionTimeMs: r.executionTimeMs,
    })),
  };
}
