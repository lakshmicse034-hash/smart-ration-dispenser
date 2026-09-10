import User from '../models/User.js';
import RationCard from '../models/RationCard.js';
import Transaction from '../models/Transaction.js';
import Notification from '../models/Notification.js';
import Inventory from '../models/Inventory.js';
import { v4 as uuidv4 } from 'uuid';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('rationCard');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { phone, address, familyMembers } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone, address, familyMembers, updatedAt: new Date() },
      { new: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('rationCard');
    const rationCard = user.rationCard;

    if (!rationCard) {
      return res.status(404).json({ message: 'Ration card not found' });
    }

    const riceRemaining = rationCard.monthlyRiceQuota - rationCard.riceUsed;
    const wheatRemaining = rationCard.monthlyWheatQuota - rationCard.wheatUsed;

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        familyMembers: user.familyMembers,
        householdType: user.householdType
      },
      rationCard: {
        cardNumber: rationCard.cardNumber,
        type: rationCard.type,
        rice: {
          allocated: rationCard.monthlyRiceQuota,
          used: rationCard.riceUsed,
          remaining: riceRemaining
        },
        wheat: {
          allocated: rationCard.monthlyWheatQuota,
          used: rationCard.wheatUsed,
          remaining: wheatRemaining
        }
      },
      dispenserStatus: 'Online'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('rationCardId')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const dispenseRation = async (req, res) => {
  try {
    const { item, quantity } = req.body;

    if (!item || !quantity) {
      return res.status(400).json({ message: 'Please provide item and quantity' });
    }

    const user = await User.findById(req.user._id).populate('rationCard');
    const rationCard = user.rationCard;

    if (!rationCard) {
      return res.status(404).json({ message: 'Ration card not found' });
    }

    // Check quota
    let maxQuantity = 0;
    if (item === 'rice') {
      maxQuantity = rationCard.monthlyRiceQuota - rationCard.riceUsed;
    } else if (item === 'wheat') {
      maxQuantity = rationCard.monthlyWheatQuota - rationCard.wheatUsed;
    } else {
      return res.status(400).json({ message: 'Invalid item' });
    }

    if (quantity > maxQuantity) {
      return res.status(400).json({
        message: 'Insufficient monthly quota',
        available: maxQuantity,
        requested: quantity
      });
    }

    // Create transaction
    const transactionId = `TXN${Date.now()}`;
    const transaction = new Transaction({
      transactionId,
      userId: req.user._id,
      rationCardId: rationCard._id,
      item,
      quantity,
      authenticationMethod: 'rfid_biometric',
      status: 'completed'
    });

    await transaction.save();

    // Update ration card
    if (item === 'rice') {
      rationCard.riceUsed += quantity;
    } else {
      rationCard.wheatUsed += quantity;
    }
    await rationCard.save();

    // Update inventory
    const inventory = await Inventory.findOne({ item });
    if (inventory) {
      inventory.currentStock -= quantity;
      if (inventory.currentStock < inventory.minimumStock) {
        inventory.status = 'critical';
      } else if (inventory.currentStock < inventory.minimumStock * 1.5) {
        inventory.status = 'low';
      } else {
        inventory.status = 'normal';
      }
      await inventory.save();
    }

    // Create notification
    const notification = new Notification({
      userId: req.user._id,
      type: 'ration_dispensed',
      title: 'Ration Dispensed',
      message: `You have successfully collected ${quantity} kg of ${item}.`
    });
    await notification.save();

    res.json({
      message: 'Ration dispensed successfully',
      transaction: {
        transactionId: transaction.transactionId,
        item: transaction.item,
        quantity: transaction.quantity,
        date: transaction.date,
        status: transaction.status
      },
      remaining: item === 'rice' 
        ? rationCard.monthlyRiceQuota - rationCard.riceUsed
        : rationCard.monthlyWheatQuota - rationCard.wheatUsed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error dispensing ration', error: error.message });
  }
};
