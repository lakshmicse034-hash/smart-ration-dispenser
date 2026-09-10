import express from 'express';
import {
  getRefills,
  createRefill,
  updateRefill
} from '../controllers/refillController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getRefills);
router.post('/', createRefill);
router.put('/:id', updateRefill);

export default router;
