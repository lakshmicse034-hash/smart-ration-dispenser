import express from 'express';
import {
  getDevices,
  updateDevice,
  simulateSolarCharging,
  simulateBatteryDrain,
  simulateDeviceOffline,
  simulateDeviceOnline
} from '../controllers/deviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getDevices);
router.put('/:id', updateDevice);
router.post('/:id/simulate/solar-charging', simulateSolarCharging);
router.post('/:id/simulate/battery-drain', simulateBatteryDrain);
router.post('/:id/simulate/offline', simulateDeviceOffline);
router.post('/:id/simulate/online', simulateDeviceOnline);

export default router;
