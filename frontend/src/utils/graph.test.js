import { describe, expect, it } from 'vitest';
import { canConnect, interpolatePath, undirectedKey } from './graph.js';

describe('graph helpers', () => {
  it('blocks self-loops and duplicate undirected links', () => {
    const nodes = [
      { id: 'A', position: { x: 0, y: 0 } },
      { id: 'B', position: { x: 10, y: 0 } },
    ];
    const edges = [{ id: 'e', source: 'A', target: 'B', weight: 1 }];
    expect(canConnect(nodes, edges, 'A', 'A').ok).toBe(false);
    expect(canConnect(nodes, edges, 'A', 'B').ok).toBe(false);
    expect(canConnect(nodes, [], 'A', 'B').ok).toBe(true);
    expect(undirectedKey('B', 'A')).toBe('A::B');
  });

  it('interpolates a packet along a polyline', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ];
    expect(interpolatePath(points, 0)).toEqual({ x: 0, y: 0, hop: 0 });
    expect(interpolatePath(points, 0.25).x).toBe(5);
    expect(interpolatePath(points, 1)).toEqual({ x: 10, y: 10, hop: 1 });
  });
});
