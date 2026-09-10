import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getUserHistory,
  getUserNotifications,
  dispenseRation
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['customer']));

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/dashboard', getUserDashboard);
router.get('/history', getUserHistory);
router.get('/notifications', getUserNotifications);
router.post('/dispense', dispenseRation);

export default router;
