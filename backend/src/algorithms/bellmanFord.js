function reconstructPath(previous, source, destination) {
  const path = [];
  const seen = new Set();
  let current = destination;
  while (current !== null && current !== undefined) {
    if (seen.has(current)) return [];
    seen.add(current);
    path.push(current);
    if (current === source) break;
    current = previous.get(current);
  }
  path.reverse();
  if (path[0] !== source) return [];
  return path;
}

function reachableFrom(adjacency, start) {
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
  return seen;
}

export function runBellmanFord(adjacency, source, destination) {
  const started = process.hrtime.bigint();

  if (!adjacency.has(source) || !adjacency.has(destination)) {
    return finish(started, {
      status: 'invalid_endpoint',
      message: 'Source or destination router is not in the network.',
    });
  }

  const nodes = [...adjacency.keys()];
  const dist = new Map();
  const previous = new Map();
  const visitedOrder = [];

  for (const node of nodes) {
    dist.set(node, Infinity);
    previous.set(node, null);
  }
  dist.set(source, 0);

  const fromSource = reachableFrom(adjacency, source);

  for (let i = 0; i < nodes.length - 1; i += 1) {
    let updated = false;
    for (const u of nodes) {
      if (!fromSource.has(u) || dist.get(u) === Infinity) continue;
      if (!visitedOrder.includes(u)) visitedOrder.push(u);
      for (const edge of adjacency.get(u) || []) {
        if (typeof edge.weight !== 'number' || Number.isNaN(edge.weight)) {
          return finish(started, {
            status: 'invalid_weight',
            message: 'All link weights must be numeric.',
          });
        }
        const candidate = dist.get(u) + edge.weight;
        if (candidate < dist.get(edge.to)) {
          dist.set(edge.to, candidate);
          previous.set(edge.to, u);
          updated = true;
        }
      }
    }
    if (!updated) break;
  }

  for (const u of nodes) {
    if (!fromSource.has(u) || dist.get(u) === Infinity) continue;
    for (const edge of adjacency.get(u) || []) {
      if (dist.get(u) + edge.weight < dist.get(edge.to)) {
        const cycleReachableToDest = reachableFrom(adjacency, edge.to).has(destination)
          || edge.to === destination;
        if (cycleReachableToDest) {
          return finish(started, {
            status: 'negative_cycle',
            message: 'A reachable negative cycle was detected. Shortest paths are undefined.',
            visitedRouters: visitedOrder,
          });
        }
      }
    }
  }

  if (!visitedOrder.includes(source)) visitedOrder.unshift(source);
  if (Number.isFinite(dist.get(destination)) && !visitedOrder.includes(destination)) {
    visitedOrder.push(destination);
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
    message: 'Shortest path found using Bellman–Ford.',
    path,
    totalCost: cost,
    hopCount: Math.max(0, path.length - 1),
    visitedRouters: visitedOrder,
  });
}

function finish(started, result) {
  const elapsedNs = Number(process.hrtime.bigint() - started);
  return {
    algorithm: 'bellman-ford',
    path: result.path || [],
    totalCost: result.totalCost ?? null,
    hopCount: result.hopCount ?? null,
    visitedRouters: result.visitedRouters || [],
    executionTimeMs: elapsedNs / 1e6,
    status: result.status,
    message: result.message,
  };
}
