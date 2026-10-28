export function nextRouterId(nodes) {
  const used = new Set(nodes.map((n) => n.id));
  let i = 1;
  while (used.has(`R${i}`)) i += 1;
  return `R${i}`;
}

export function nextEdgeId(edges, source, target) {
  const base = `e-${source}-${target}`;
  if (!edges.some((e) => e.id === base)) return base;
  return `${base}-${Date.now()}`;
}

export function undirectedKey(a, b) {
  return [a, b].sort().join('::');
}

export function canConnect(nodes, edges, source, target) {
  if (!source || !target) return { ok: false, reason: 'Select two routers to create a link.' };
  if (source === target) return { ok: false, reason: 'Self-loops are not allowed.' };
  const ids = new Set(nodes.map((n) => n.id));
  if (!ids.has(source) || !ids.has(target)) return { ok: false, reason: 'Unknown router.' };
  const key = undirectedKey(source, target);
  if (edges.some((e) => undirectedKey(e.source, e.target) === key)) {
    return { ok: false, reason: 'Those routers are already linked.' };
  }
  return { ok: true };
}

export function topologyToFlow(nodes, edges, visual = {}) {
  const { path = [], visited = [], source, destination, noRoute = false } = visual;
  const pathSet = new Set(path);
  const visitedSet = new Set(visited);
  const pathEdges = new Set();
  for (let i = 0; i < path.length - 1; i += 1) {
    pathEdges.add(undirectedKey(path[i], path[i + 1]));
  }

  const flowNodes = nodes.map((node) => {
    let role = 'idle';
    if (node.id === source) role = 'source';
    else if (node.id === destination) role = 'destination';
    else if (pathSet.has(node.id)) role = 'path';
    else if (visitedSet.has(node.id)) role = 'visited';
    if (noRoute && node.id === destination) role = 'unreachable';
    return {
      id: node.id,
      type: 'router',
      position: node.position || { x: 0, y: 0 },
      data: { label: node.label || node.id, role },
    };
  });

  const flowEdges = edges.map((edge) => {
    const onPath = pathEdges.has(undirectedKey(edge.source, edge.target));
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'cost',
      data: { weight: edge.weight, onPath },
      animated: onPath,
    };
  });

  return { flowNodes, flowEdges };
}

export function flowToTopology(nodes, edges) {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      label: n.data?.label || n.id,
      position: n.position,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      weight: Number(e.data?.weight ?? 1),
      bidirectional: true,
    })),
  };
}

export function interpolatePath(points, progress) {
  if (!points.length) return null;
  if (points.length === 1) return points[0];
  const clamped = Math.min(1, Math.max(0, progress));
  const segments = points.length - 1;
  const exact = clamped * segments;
  const index = Math.min(segments - 1, Math.floor(exact));
  const t = exact - index;
  const a = points[index];
  const b = points[index + 1];
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    hop: index,
  };
}

export const ALGORITHM_META = {
  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra",
    summary: 'Lowest total link cost. Rejects negative weights.',
  },
  'bellman-ford': {
    id: 'bellman-ford',
    name: 'Bellman–Ford',
    summary: 'Lowest total cost; supports negatives and detects negative cycles.',
  },
  bfs: {
    id: 'bfs',
    name: 'BFS',
    summary: 'Fewest hops. Ignores weights when choosing the path.',
  },
};
