import mongoose from 'mongoose';

const refillSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    enum: ['rice', 'wheat']
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Refill = mongoose.model('Refill', refillSchema);
export default Refill;
