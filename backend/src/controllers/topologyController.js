import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createTopology,
  deleteTopology,
  ensureDemoPersisted,
  getDemoNetwork,
  getTopologyById,
  listTopologies,
  updateTopology,
} from '../services/topologyService.js';

export const list = asyncHandler(async (req, res) => {
  const data = await listTopologies();
  res.json({ success: true, data });
});

export const demo = asyncHandler(async (req, res) => {
  res.json({ success: true, data: getDemoNetwork() });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await getTopologyById(req.params.id);
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await createTopology(req.body || {});
  res.status(201).json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await updateTopology(req.params.id, req.body || {});
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  const data = await deleteTopology(req.params.id);
  res.json({ success: true, data });
});

export const seedDemo = asyncHandler(async (req, res) => {
  const data = await ensureDemoPersisted();
  res.json({ success: true, data });
});
