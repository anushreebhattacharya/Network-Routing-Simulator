import { describe, expect, it } from 'vitest';
import { runDijkstra } from '../src/algorithms/dijkstra.js';
import { graphFromPairs } from './helpers.js';

describe('Dijkstra', () => {
  it('finds the lowest-cost path on a small campus graph', () => {
    const adj = graphFromPairs([
      ['A', 'B', 4],
      ['A', 'C', 2],
      ['B', 'C', 1],
      ['B', 'D', 5],
      ['C', 'D', 8],
    ]);
    const result = runDijkstra(adj, 'A', 'D');
    expect(result.status).toBe('ok');
    expect(result.path).toEqual(['A', 'C', 'B', 'D']);
    expect(result.totalCost).toBe(8);
    expect(result.hopCount).toBe(3);
    expect(result.visitedRouters[0]).toBe('A');
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('rejects negative link weights', () => {
    const adj = graphFromPairs([
      ['A', 'B', 1],
      ['B', 'C', -2],
    ]);
    const result = runDijkstra(adj, 'A', 'C');
    expect(result.status).toBe('negative_weight_rejected');
    expect(result.path).toEqual([]);
  });

  it('reports no route on a disconnected graph', () => {
    const adj = graphFromPairs(
      [
        ['A', 'B', 1],
        ['C', 'D', 1],
      ],
      ['A', 'B', 'C', 'D'],
    );
    const result = runDijkstra(adj, 'A', 'D');
    expect(result.status).toBe('no_route');
  });
});
