import { Router } from 'express';
import {
  create,
  demo,
  getOne,
  list,
  remove,
  seedDemo,
  update,
} from '../controllers/topologyController.js';
import { requireJsonObject } from '../middleware/validate.js';

const router = Router();
router.get('/', list);
router.get('/demo', demo);
router.post('/demo/seed', seedDemo);
router.get('/:id', getOne);
router.post('/', requireJsonObject, create);
router.put('/:id', requireJsonObject, update);
router.delete('/:id', remove);
export default router;
