import User from '../models/User.js';
import RationCard from '../models/RationCard.js';
import Transaction from '../models/Transaction.js';
import Inventory from '../models/Inventory.js';
import Device from '../models/Device.js';
import Notification from '../models/Notification.js';
import Refill from '../models/Refill.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalRationCards = await RationCard.countDocuments();
    const todayTransactions = await Transaction.countDocuments({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    const monthTransactions = await Transaction.countDocuments({
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      }
    });

    const riceInventory = await Inventory.findOne({ item: 'rice' });
    const wheatInventory = await Inventory.findOne({ item: 'wheat' });

    const activeDevices = await Device.countDocuments({ status: 'online' });
    const offlineDevices = await Device.countDocuments({ status: 'offline' });

    res.json({
      stats: {
        totalCustomers,
        totalRationCards,
        todayDistributions: todayTransactions,
        monthlyDistributions: monthTransactions,
        activeDevices,
        offlineDevices
      },
      inventory: {
        rice: riceInventory || { currentStock: 0, status: 'normal' },
        wheat: wheatInventory || { currentStock: 0, status: 'normal' }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('rationCard')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('rationCard');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, familyMembers, householdType, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, familyMembers, householdType, isActive, updatedAt: new Date() },
      { new: true }
    ).populate('rationCard');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const getDistributionHistory = async (req, res) => {
  try {
    const { search, item, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      const user = await User.findOne({ name: { $regex: search, $options: 'i' } });
      if (user) query.userId = user._id;
    }

    if (item) query.item = item;

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .populate('rationCardId', 'cardNumber')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};
