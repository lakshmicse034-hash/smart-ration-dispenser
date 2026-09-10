import Device from '../models/Device.js';
import Notification from '../models/Notification.js';

export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { status, battery, solarCharging, temperature, network } = req.body;
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      {
        status,
        battery,
        solarCharging,
        temperature,
        network,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({ message: 'Device updated', device });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};

export const simulateSolarCharging = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.solarCharging = !device.solarCharging;
    if (device.solarCharging) {
      device.battery = Math.min(100, device.battery + 10);
    }
    device.lastUpdated = new Date();
    await device.save();

    res.json({ message: 'Solar charging simulated', device });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating solar charging', error: error.message });
  }
};

export const simulateBatteryDrain = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.battery = Math.max(0, device.battery - 10);
    device.lastUpdated = new Date();
    await device.save();

    if (device.battery < 20) {
      const notification = new Notification({
        userId: null,
        type: 'low_battery_alert',
        title: 'Low Battery Alert',
        message: `Device ${device.deviceId} battery is low: ${device.battery}%`
      });
      await notification.save();
    }

    res.json({ message: 'Battery drain simulated', device });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating battery drain', error: error.message });
  }
};

export const simulateDeviceOffline = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { status: 'offline', network: 'disconnected', lastUpdated: new Date() },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const notification = new Notification({
      userId: null,
      type: 'device_offline_alert',
      title: 'Device Offline',
      message: `Smart dispenser ${device.deviceId} is offline.`
    });
    await notification.save();

    res.json({ message: 'Device set to offline', device });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};

export const simulateDeviceOnline = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { status: 'online', network: 'connected', lastUpdated: new Date() },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({ message: 'Device set to online', device });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};
