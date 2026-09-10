import express from 'express';
import {
  getAdminNotifications,
  markAsRead
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getAdminNotifications);
router.put('/:id/read', markAsRead);

export default router;
