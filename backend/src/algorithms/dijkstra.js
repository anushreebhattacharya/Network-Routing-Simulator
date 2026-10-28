function reconstructPath(previous, source, destination) {
  const path = [];
  let current = destination;
  while (current !== null && current !== undefined) {
    path.push(current);
    if (current === source) break;
    current = previous.get(current);
  }
  path.reverse();
  if (path[0] !== source) return [];
  return path;
}

export function runDijkstra(adjacency, source, destination, options = {}) {
  const { allowNegative = false } = options;
  const started = process.hrtime.bigint();

  for (const [, neighbors] of adjacency) {
    for (const edge of neighbors) {
      if (typeof edge.weight !== 'number' || Number.isNaN(edge.weight)) {
        return finish(started, {
          status: 'invalid_weight',
          message: 'All link weights must be numeric.',
        });
      }
      if (!allowNegative && edge.weight < 0) {
        return finish(started, {
          status: 'negative_weight_rejected',
          message: "Dijkstra cannot run on graphs with negative link costs. Use Bellman–Ford instead.",
        });
      }
    }
  }

  const dist = new Map();
  const previous = new Map();
  const visited = new Set();
  const visitedOrder = [];

  for (const node of adjacency.keys()) {
    dist.set(node, Infinity);
    previous.set(node, null);
  }

  if (!adjacency.has(source) || !adjacency.has(destination)) {
    return finish(started, {
      status: 'invalid_endpoint',
      message: 'Source or destination router is not in the network.',
    });
  }

  dist.set(source, 0);
  const queue = [{ id: source, distance: 0 }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const { id: u } = queue.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    visitedOrder.push(u);

    if (u === destination) break;

    for (const edge of adjacency.get(u) || []) {
      if (visited.has(edge.to)) continue;
      const candidate = dist.get(u) + edge.weight;
      if (candidate < dist.get(edge.to)) {
        dist.set(edge.to, candidate);
        previous.set(edge.to, u);
        queue.push({ id: edge.to, distance: candidate });
      }
    }
  }

  const path = reconstructPath(previous, source, destination);
  const cost = dist.get(destination);

  if (!path.length || !Number.isFinite(cost)) {
    return finish(started, {
      status: 'no_route',
      message: 'No route exists between the selected routers (network may be disconnected).',
      visitedRouters: visitedOrder,
    });
  }

  return finish(started, {
    status: 'ok',
    message: 'Shortest path found using Dijkstra.',
    path,
    totalCost: cost,
    hopCount: Math.max(0, path.length - 1),
    visitedRouters: visitedOrder,
  });
}

function finish(started, result) {
  const elapsedNs = Number(process.hrtime.bigint() - started);
  return {
    algorithm: 'dijkstra',
    path: result.path || [],
    totalCost: result.totalCost ?? null,
    hopCount: result.hopCount ?? null,
    visitedRouters: result.visitedRouters || [],
    executionTimeMs: elapsedNs / 1e6,
    status: result.status,
    message: result.message,
  };
}
