import { Topology } from '../models/Topology.js';
import { DEMO_NETWORK } from '../data/demoNetwork.js';
import { normalizeTopology } from './graphService.js';
import { AppError } from '../utils/AppError.js';

function serialize(doc) {
  const obj = doc.toObject({ virtuals: false });
  return {
    id: String(obj._id),
    name: obj.name,
    description: obj.description,
    nodes: obj.nodes,
    edges: obj.edges,
    defaultSource: obj.defaultSource,
    defaultDestination: obj.defaultDestination,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export function getDemoNetwork() {
  return { id: 'demo', ...DEMO_NETWORK };
}

export async function listTopologies() {
  const docs = await Topology.find().sort({ updatedAt: -1 });
  return docs.map(serialize);
}

export async function getTopologyById(id) {
  const doc = await Topology.findById(id);
  if (!doc) {
    throw new AppError('Saved topology not found.', 404, 'NOT_FOUND');
  }
  return serialize(doc);
}

export async function createTopology(payload) {
  const name = String(payload.name || '').trim();
  if (!name) {
    throw new AppError('Topology name is required.', 400, 'VALIDATION_ERROR');
  }
  const topology = normalizeTopology(payload.nodes || [], payload.edges || []);
  const doc = await Topology.create({
    name,
    description: String(payload.description || '').trim(),
    ...topology,
    defaultSource: payload.defaultSource || '',
    defaultDestination: payload.defaultDestination || '',
  });
  return serialize(doc);
}

export async function updateTopology(id, payload) {
  const existing = await Topology.findById(id);
  if (!existing) {
    throw new AppError('Saved topology not found.', 404, 'NOT_FOUND');
  }
  const name = String(payload.name ?? existing.name).trim();
  if (!name) {
    throw new AppError('Topology name is required.', 400, 'VALIDATION_ERROR');
  }
  const topology = normalizeTopology(payload.nodes ?? existing.nodes, payload.edges ?? existing.edges);
  existing.name = name;
  existing.description = String(payload.description ?? existing.description ?? '').trim();
  existing.nodes = topology.nodes;
  existing.edges = topology.edges;
  existing.defaultSource = payload.defaultSource ?? existing.defaultSource;
  existing.defaultDestination = payload.defaultDestination ?? existing.defaultDestination;
  await existing.save();
  return serialize(existing);
}

export async function deleteTopology(id) {
  const doc = await Topology.findByIdAndDelete(id);
  if (!doc) {
    throw new AppError('Saved topology not found.', 404, 'NOT_FOUND');
  }
  return { id };
}

export async function ensureDemoPersisted() {
  const existing = await Topology.findOne({ name: DEMO_NETWORK.name });
  if (existing) return serialize(existing);
  const topology = normalizeTopology(DEMO_NETWORK.nodes, DEMO_NETWORK.edges);
  const doc = await Topology.create({
    ...DEMO_NETWORK,
    ...topology,
  });
  return serialize(doc);
}
