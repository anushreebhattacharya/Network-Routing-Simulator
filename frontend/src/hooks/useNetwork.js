import { useCallback, useMemo, useState } from 'react';
import { canConnect, nextEdgeId, nextRouterId } from '../utils/graph.js';

const EMPTY = { nodes: [], edges: [] };

export function useNetwork(initial = EMPTY) {
  const [nodes, setNodes] = useState(initial.nodes || []);
  const [edges, setEdges] = useState(initial.edges || []);
  const [notice, setNotice] = useState(null);

  const load = useCallback((topology) => {
    setNodes(topology.nodes || []);
    setEdges(topology.edges || []);
    setNotice(null);
  }, []);

  const reset = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNotice('Canvas cleared.');
  }, []);

  const addRouter = useCallback((position) => {
    setNodes((current) => {
      const id = nextRouterId(current);
      const pos = position || { x: 120 + current.length * 40, y: 120 + (current.length % 4) * 70 };
      return [...current, { id, label: id, position: pos }];
    });
  }, []);

  const moveRouter = useCallback((id, position) => {
    setNodes((current) => current.map((n) => (n.id === id ? { ...n, position } : n)));
  }, []);

  const deleteRouter = useCallback((id) => {
    setNodes((current) => current.filter((n) => n.id !== id));
    setEdges((current) => current.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const addLink = useCallback((source, target, weight = 1) => {
    setEdges((current) => {
      const snapshotNodes = nodes;
      const check = canConnect(snapshotNodes, current, source, target);
      if (!check.ok) {
        setNotice(check.reason);
        return current;
      }
      const numeric = Number(weight);
      if (!Number.isFinite(numeric)) {
        setNotice('Link cost must be a number.');
        return current;
      }
      setNotice(null);
      return [
        ...current,
        {
          id: nextEdgeId(current, source, target),
          source,
          target,
          weight: numeric,
          bidirectional: true,
        },
      ];
    });
  }, [nodes]);

  const updateLinkWeight = useCallback((id, weight) => {
    const numeric = Number(weight);
    if (!Number.isFinite(numeric)) {
      setNotice('Link cost must be a number.');
      return;
    }
    setEdges((current) => current.map((e) => (e.id === id ? { ...e, weight: numeric } : e)));
  }, []);

  const deleteLink = useCallback((id) => {
    setEdges((current) => current.filter((e) => e.id !== id));
  }, []);

  const summary = useMemo(
    () => ({ routerCount: nodes.length, linkCount: edges.length }),
    [nodes.length, edges.length],
  );

  return {
    nodes,
    edges,
    notice,
    setNotice,
    load,
    reset,
    addRouter,
    moveRouter,
    deleteRouter,
    addLink,
    updateLinkWeight,
    deleteLink,
    summary,
  };
}
