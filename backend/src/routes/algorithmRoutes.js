import { Router } from 'express';
import { compare, runAlgorithm } from '../controllers/algorithmController.js';
import { requireJsonObject } from '../middleware/validate.js';

const router = Router();
router.post('/run', requireJsonObject, runAlgorithm);
router.post('/compare', requireJsonObject, compare);
export default router;
