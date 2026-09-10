import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    unique: true,
    enum: ['rice', 'wheat']
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 50
  },
  allocatedStock: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['normal', 'low', 'critical'],
    default: 'normal'
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

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
