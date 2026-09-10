import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  battery: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  solarCharging: {
    type: Boolean,
    default: false
  },
  temperature: {
    type: Number,
    default: 25
  },
  network: {
    type: String,
    enum: ['connected', 'disconnected'],
    default: 'connected'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Device = mongoose.model('Device', deviceSchema);
export default Device;
