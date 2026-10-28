import { asyncHandler } from '../middleware/errorHandler.js';
import { compareAlgorithms, executeAlgorithm } from '../services/algorithmService.js';

export const runAlgorithm = asyncHandler(async (req, res) => {
  const data = executeAlgorithm(req.body || {});
  res.json({ success: true, data });
});

export const compare = asyncHandler(async (req, res) => {
  const data = compareAlgorithms(req.body || {});
  res.json({ success: true, data });
});
