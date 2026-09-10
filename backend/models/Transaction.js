import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rationCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RationCard',
    required: true
  },
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
  authenticationMethod: {
    type: String,
    enum: ['rfid', 'biometric', 'rfid_biometric'],
    default: 'rfid_biometric'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
