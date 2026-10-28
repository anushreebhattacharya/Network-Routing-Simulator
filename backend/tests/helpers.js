export function graphFromPairs(pairs, nodeIds) {
  const adjacency = new Map();
  const ids = nodeIds || [...new Set(pairs.flatMap(([a, b]) => [a, b]))];
  for (const id of ids) adjacency.set(id, []);
  for (const [a, b, w] of pairs) {
    adjacency.get(a).push({ to: b, weight: w, edgeId: `${a}-${b}` });
    adjacency.get(b).push({ to: a, weight: w, edgeId: `${a}-${b}` });
  }
  return adjacency;
}
