import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { DEMO_NETWORK } from '../src/data/demoNetwork.js';

const app = createApp();

describe('REST APIs (algorithms, no database)', () => {
  it('reports health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('runs Dijkstra on the demo topology', async () => {
    const res = await request(app)
      .post('/api/algorithms/run')
      .send({
        algorithm: 'dijkstra',
        nodes: DEMO_NETWORK.nodes,
        edges: DEMO_NETWORK.edges,
        source: 'R1',
        destination: 'R8',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.path[0]).toBe('R1');
    expect(res.body.data.path.at(-1)).toBe('R8');
    expect(res.body.data.routingTable.length).toBe(DEMO_NETWORK.nodes.length);
  });

  it('compares all three algorithms', async () => {
    const res = await request(app)
      .post('/api/algorithms/compare')
      .send({
        nodes: DEMO_NETWORK.nodes,
        edges: DEMO_NETWORK.edges,
        source: 'R1',
        destination: 'R8',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.results).toHaveLength(3);
    expect(res.body.data.timingDisclaimer).toMatch(/informational/i);
  });

  it('returns a consistent validation error for a self-loop', async () => {
    const res = await request(app)
      .post('/api/algorithms/run')
      .send({
        algorithm: 'bfs',
        nodes: [{ id: 'A', position: { x: 0, y: 0 } }],
        edges: [{ source: 'A', target: 'A', weight: 1 }],
        source: 'A',
        destination: 'A',
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBeTruthy();
  });

  it('returns the in-memory demo topology', async () => {
    const res = await request(app).get('/api/topologies/demo');
    expect(res.status).toBe(200);
    expect(res.body.data.nodes.length).toBe(8);
  });
});
