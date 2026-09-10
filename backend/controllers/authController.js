import User from '../models/User.js';
import RationCard from '../models/RationCard.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role, familyMembers, householdType } = req.body;

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'customer',
      familyMembers: familyMembers || 1,
      householdType: householdType || 'BPL'
    });

    await user.save();

    // Create ration card for customers
    if (user.role === 'customer') {
      const cardNumber = `TN-RC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
      const rationCard = new RationCard({
        cardNumber,
        userId: user._id,
        type: householdType || 'BPL',
        monthlyRiceQuota: 20,
        monthlyWheatQuota: 10
      });
      await rationCard.save();
      user.rationCard = rationCard._id;
      await user.save();
    }

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('rationCard');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
