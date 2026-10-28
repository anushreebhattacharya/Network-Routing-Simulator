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

export function runBfs(adjacency, source, destination) {
  const started = process.hrtime.bigint();

  if (!adjacency.has(source) || !adjacency.has(destination)) {
    return finish(started, {
      status: 'invalid_endpoint',
      message: 'Source or destination router is not in the network.',
    });
  }

  const previous = new Map();
  const hops = new Map();
  const visitedOrder = [];
  const visited = new Set([source]);
  previous.set(source, null);
  hops.set(source, 0);

  const queue = [source];

  while (queue.length) {
    const u = queue.shift();
    visitedOrder.push(u);
    if (u === destination) break;

    for (const edge of adjacency.get(u) || []) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      previous.set(edge.to, u);
      hops.set(edge.to, hops.get(u) + 1);
      queue.push(edge.to);
    }
  }

  const path = reconstructPath(previous, source, destination);
  if (!path.length) {
    return finish(started, {
      status: 'no_route',
      message: 'No route exists between the selected routers (network may be disconnected).',
      visitedRouters: visitedOrder,
    });
  }

  let totalCost = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const edge = (adjacency.get(path[i]) || []).find((e) => e.to === path[i + 1]);
    if (!edge) {
      totalCost = null;
      break;
    }
    totalCost += edge.weight;
  }

  return finish(started, {
    status: 'ok',
    message: 'Minimum-hop path found using BFS (unweighted hop count).',
    path,
    totalCost,
    hopCount: hops.get(destination),
    visitedRouters: visitedOrder,
  });
}

function finish(started, result) {
  const elapsedNs = Number(process.hrtime.bigint() - started);
  return {
    algorithm: 'bfs',
    path: result.path || [],
    totalCost: result.totalCost ?? null,
    hopCount: result.hopCount ?? null,
    visitedRouters: result.visitedRouters || [],
    executionTimeMs: elapsedNs / 1e6,
    status: result.status,
    message: result.message,
  };
}
