import mongoose from 'mongoose';

const rationCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['APL', 'BPL', 'AAY'],
    default: 'BPL'
  },
  monthlyRiceQuota: {
    type: Number,
    default: 20
  },
  monthlyWheatQuota: {
    type: Number,
    default: 10
  },
  riceUsed: {
    type: Number,
    default: 0
  },
  wheatUsed: {
    type: Number,
    default: 0
  },
  currentMonth: {
    type: String,
    default: () => new Date().toISOString().slice(0, 7)
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

const RationCard = mongoose.model('RationCard', rationCardSchema);
export default RationCard;
