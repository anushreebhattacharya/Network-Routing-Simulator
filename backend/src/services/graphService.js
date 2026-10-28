import { AppError } from '../utils/AppError.js';

export function normalizeTopology(nodes = [], edges = []) {
  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    throw new AppError('Nodes and edges must be arrays.', 400, 'VALIDATION_ERROR');
  }

  if (nodes.length === 0) {
    throw new AppError('Add at least one router before running an algorithm.', 400, 'EMPTY_NETWORK');
  }

  const ids = new Set();
  const normalizedNodes = nodes.map((node, index) => {
    const id = String(node.id ?? '').trim();
    if (!id) {
      throw new AppError(`Router at index ${index} is missing an id.`, 400, 'VALIDATION_ERROR');
    }
    if (ids.has(id)) {
      throw new AppError(`Duplicate router id "${id}".`, 400, 'DUPLICATE_ROUTER');
    }
    ids.add(id);
    return {
      id,
      label: String(node.label || id),
      position: {
        x: Number(node.position?.x ?? node.x ?? 0),
        y: Number(node.position?.y ?? node.y ?? 0),
      },
    };
  });

  const undirectedKeys = new Set();
  const normalizedEdges = [];

  edges.forEach((edge, index) => {
    const source = String(edge.source ?? '').trim();
    const target = String(edge.target ?? '').trim();
    const weight = Number(edge.weight);
    const bidirectional = edge.bidirectional !== false;

    if (!source || !target) {
      throw new AppError(`Link at index ${index} must have source and target routers.`, 400, 'VALIDATION_ERROR');
    }
    if (source === target) {
      throw new AppError('Self-loops are not allowed. A router cannot link to itself.', 400, 'SELF_LOOP');
    }
    if (!ids.has(source) || !ids.has(target)) {
      throw new AppError(
        `Link ${source} → ${target} references a router that does not exist.`,
        400,
        'UNKNOWN_ENDPOINT',
      );
    }
    if (!Number.isFinite(weight)) {
      throw new AppError(`Link ${source} → ${target} has an invalid cost.`, 400, 'INVALID_WEIGHT');
    }

    const key = [source, target].sort().join('::');
    if (undirectedKeys.has(key)) {
      throw new AppError(
        `Duplicate link between ${source} and ${target}.`,
        400,
        'DUPLICATE_LINK',
      );
    }
    undirectedKeys.add(key);

    normalizedEdges.push({
      id: String(edge.id || `${source}-${target}`),
      source,
      target,
      weight,
      bidirectional,
    });
  });

  return { nodes: normalizedNodes, edges: normalizedEdges };
}

export function buildAdjacency({ nodes, edges }) {
  const adjacency = new Map();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    adjacency.get(edge.source).push({
      to: edge.target,
      weight: edge.weight,
      edgeId: edge.id,
    });
    if (edge.bidirectional !== false) {
      adjacency.get(edge.target).push({
        to: edge.source,
        weight: edge.weight,
        edgeId: edge.id,
      });
    }
  }

  return adjacency;
}

export function isConnectedUndirected({ nodes, edges }) {
  if (nodes.length === 0) return true;
  const adjacency = buildAdjacency({ nodes, edges });
  const start = nodes[0].id;
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const u = stack.pop();
    for (const edge of adjacency.get(u) || []) {
      if (!seen.has(edge.to)) {
        seen.add(edge.to);
        stack.push(edge.to);
      }
    }
  }
  return seen.size === nodes.length;
}

export function validateEndpoints(nodes, source, destination) {
  const sourceId = String(source ?? '').trim();
  const destId = String(destination ?? '').trim();
  if (!sourceId || !destId) {
    throw new AppError('Select both a source and a destination router.', 400, 'MISSING_ENDPOINTS');
  }
  if (sourceId === destId) {
    throw new AppError('Source and destination must be different routers.', 400, 'SAME_ENDPOINTS');
  }
  const ids = new Set(nodes.map((n) => n.id));
  if (!ids.has(sourceId) || !ids.has(destId)) {
    throw new AppError('Source or destination is not part of the current network.', 400, 'UNKNOWN_ENDPOINT');
  }
  return { sourceId, destId };
}

export function buildRoutingTable(adjacency, source, runFn) {
  const rows = [];
  for (const destination of adjacency.keys()) {
    if (destination === source) {
      rows.push({
        destination,
        nextHop: '-',
        pathCost: 0,
        hops: 0,
        path: [source],
        status: 'local',
        routeInfo: 'Local router',
      });
      continue;
    }
    const result = runFn(adjacency, source, destination);
    if (result.status !== 'ok') {
      rows.push({
        destination,
        nextHop: null,
        pathCost: null,
        hops: null,
        path: [],
        status: result.status,
        routeInfo: result.message,
      });
      continue;
    }
    rows.push({
      destination,
      nextHop: result.path[1] || null,
      pathCost: result.totalCost,
      hops: result.hopCount,
      path: result.path,
      status: 'ok',
      routeInfo: result.path.join(' → '),
    });
  }
  rows.sort((a, b) => a.destination.localeCompare(b.destination));
  return rows;
}
