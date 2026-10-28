import { describe, expect, it } from 'vitest';
import { runBfs } from '../src/algorithms/bfs.js';
import { graphFromPairs } from './helpers.js';

describe('BFS', () => {
  it('optimizes hop count rather than weighted cost', () => {
    const adj = graphFromPairs([
      ['A', 'B', 1],
      ['B', 'D', 1],
      ['A', 'C', 100],
      ['C', 'D', 100],
    ]);
    const cheapManyHops = graphFromPairs([
      ['A', 'X', 1],
      ['X', 'Y', 1],
      ['Y', 'D', 1],
      ['A', 'D', 50],
    ]);

    const hops = runBfs(adj, 'A', 'D');
    expect(hops.status).toBe('ok');
    expect(hops.hopCount).toBe(2);

    const direct = runBfs(cheapManyHops, 'A', 'D');
    expect(direct.hopCount).toBe(1);
    expect(direct.path).toEqual(['A', 'D']);
    expect(direct.totalCost).toBe(50);
  });

  it('reports no route when destination is unreachable', () => {
    const adj = graphFromPairs(
      [['A', 'B', 1]],
      ['A', 'B', 'C'],
    );
    const result = runBfs(adj, 'A', 'C');
    expect(result.status).toBe('no_route');
  });
});
