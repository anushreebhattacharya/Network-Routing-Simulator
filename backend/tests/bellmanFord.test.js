import { describe, expect, it } from 'vitest';
import { runBellmanFord } from '../src/algorithms/bellmanFord.js';
import { graphFromPairs } from './helpers.js';

describe('Bellman–Ford', () => {
  it('handles negative weights without a negative cycle', () => {
    const adj = new Map([
      ['A', [{ to: 'B', weight: 1, edgeId: 'ab' }]],
      ['B', [{ to: 'C', weight: -2, edgeId: 'bc' }]],
      ['C', []],
    ]);
    const result = runBellmanFord(adj, 'A', 'C');
    expect(result.status).toBe('ok');
    expect(result.path).toEqual(['A', 'B', 'C']);
    expect(result.totalCost).toBe(-1);
  });

  it('detects a reachable negative cycle', () => {
    const adj = new Map([
      ['A', [{ to: 'B', weight: 1, edgeId: 'ab' }]],
      ['B', [{ to: 'C', weight: 1, edgeId: 'bc' }]],
      ['C', [{ to: 'B', weight: -3, edgeId: 'cb' }]],
    ]);
    const result = runBellmanFord(adj, 'A', 'C');
    expect(result.status).toBe('negative_cycle');
  });

  it('finds a path matching Dijkstra on non-negative graphs', () => {
    const adj = graphFromPairs([
      ['A', 'B', 4],
      ['A', 'C', 2],
      ['B', 'C', 1],
      ['B', 'D', 5],
      ['C', 'D', 8],
    ]);
    const result = runBellmanFord(adj, 'A', 'D');
    expect(result.status).toBe('ok');
    expect(result.totalCost).toBe(8);
    expect(result.path[0]).toBe('A');
    expect(result.path.at(-1)).toBe('D');
  });
});
