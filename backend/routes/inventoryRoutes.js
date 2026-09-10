import express from 'express';
import {
  getInventory,
  updateInventory,
  simulateLowStock
} from '../controllers/inventoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getInventory);
router.put('/:id', updateInventory);
router.post('/simulate/low-stock', simulateLowStock);

export default router;
