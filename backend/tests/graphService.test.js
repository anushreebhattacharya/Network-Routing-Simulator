import { describe, expect, it } from 'vitest';
import { buildAdjacency, normalizeTopology } from '../src/services/graphService.js';
import { AppError } from '../src/utils/AppError.js';

describe('graphService', () => {
  it('builds bidirectional adjacency by default', () => {
    const topology = normalizeTopology(
      [
        { id: 'A', position: { x: 0, y: 0 } },
        { id: 'B', position: { x: 1, y: 0 } },
      ],
      [{ source: 'A', target: 'B', weight: 3 }],
    );
    const adj = buildAdjacency(topology);
    expect(adj.get('A')).toEqual([expect.objectContaining({ to: 'B', weight: 3 })]);
    expect(adj.get('B')).toEqual([expect.objectContaining({ to: 'A', weight: 3 })]);
  });

  it('rejects self-loops and duplicate links', () => {
    const nodes = [
      { id: 'A', position: { x: 0, y: 0 } },
      { id: 'B', position: { x: 1, y: 0 } },
    ];
    expect(() => normalizeTopology(nodes, [{ source: 'A', target: 'A', weight: 1 }])).toThrow(AppError);
    expect(() =>
      normalizeTopology(nodes, [
        { source: 'A', target: 'B', weight: 1 },
        { source: 'B', target: 'A', weight: 2 },
      ]),
    ).toThrow(AppError);
  });
});
