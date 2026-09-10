import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import RationCard from '../models/RationCard.js';
import Inventory from '../models/Inventory.js';
import Transaction from '../models/Transaction.js';
import Device from '../models/Device.js';
import Notification from '../models/Notification.js';
import Refill from '../models/Refill.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await RationCard.deleteMany({});
    await Inventory.deleteMany({});
    await Transaction.deleteMany({});
    await Device.deleteMany({});
    await Notification.deleteMany({});
    await Refill.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin User
    const admin = new User({
      name: 'Admin User',
      email: 'admin@smartration.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
      address: 'Admin Office, Chennai',
      familyMembers: 1,
      householdType: 'APL'
    });
    await admin.save();
    console.log('Admin user created');

    // Create Customer Users
    const customers = [];
    const customerNames = [
      'Lakshmi', 'Priya', 'Ramesh', 'Sunita', 'Vijay',
      'Anjali', 'Suresh', 'Meena', 'Arjun', 'Divya',
      'Arun', 'Neha', 'Ravi', 'Shweta', 'Manoj',
      'Pooja', 'Ashok', 'Kavya', 'Karthik', 'Nisha'
    ];

    for (let i = 0; i < 20; i++) {
      const customer = new User({
        name: customerNames[i],
        email: `user${i + 1}@smartration.com`,
        password: i === 0 ? 'user123' : 'password123',
        phone: `987654${String(i).padStart(4, '0')}`,
        role: 'customer',
        address: `Address ${i + 1}, Tamil Nadu`,
        familyMembers: Math.floor(Math.random() * 6) + 1,
        householdType: ['APL', 'BPL', 'AAY'][Math.floor(Math.random() * 3)]
      });
      await customer.save();

      // Create Ration Card
      const cardNumber = `TN-RC-2026-${String(i + 1).padStart(5, '0')}`;
      const rationCard = new RationCard({
        cardNumber,
        userId: customer._id,
        type: customer.householdType,
        monthlyRiceQuota: 20,
        monthlyWheatQuota: 10,
        riceUsed: Math.floor(Math.random() * 15),
        wheatUsed: Math.floor(Math.random() * 8)
      });
      await rationCard.save();

      customer.rationCard = rationCard._id;
      await customer.save();
      customers.push(customer);
    }
    console.log('20 customer users created');

    // Create Inventory
    const inventory = [
      new Inventory({
        item: 'rice',
        currentStock: 500,
        minimumStock: 50,
        allocatedStock: 200,
        status: 'normal'
      }),
      new Inventory({
        item: 'wheat',
        currentStock: 300,
        minimumStock: 30,
        allocatedStock: 150,
        status: 'normal'
      })
    ];
    await Inventory.insertMany(inventory);
    console.log('Inventory created');

    // Create Transactions
    for (let i = 0; i < 25; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const rationCard = await RationCard.findOne({ userId: customer._id });
      const item = Math.random() > 0.5 ? 'rice' : 'wheat';

      const transaction = new Transaction({
        transactionId: `TXN${1000 + i}`,
        userId: customer._id,
        rationCardId: rationCard._id,
        item,
        quantity: Math.floor(Math.random() * 5) + 1,
        date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        authenticationMethod: 'rfid_biometric',
        status: 'completed'
      });
      await transaction.save();
    }
    console.log('25 transactions created');

    // Create IoT Device
    const device = new Device({
      deviceId: 'SRD-001',
      status: 'online',
      battery: 85,
      solarCharging: true,
      temperature: 28,
      network: 'connected'
    });
    await device.save();
    console.log('IoT device created');

    // Create Customer Notifications
    for (let i = 0; i < 10; i++) {
      const customer = customers[i];
      const notification = new Notification({
        userId: customer._id,
        type: 'ration_reminder',
        title: 'Monthly Ration Available',
        message: `Your September 2026 ration quota is now available. Please collect it at your nearest dispenser.`,
        read: false
      });
      await notification.save();
    }

    // Create Admin Notifications
    const adminNotifications = [
      new Notification({
        userId: null,
        type: 'low_stock_alert',
        title: 'Low Stock Alert',
        message: 'Rice stock is running low. Current: 450 kg',
        read: false
      }),
      new Notification({
        userId: null,
        type: 'device_status',
        title: 'Device Online',
        message: 'Smart dispenser SRD-001 is now online.',
        read: false
      }),
      new Notification({
        userId: null,
        type: 'refill_required',
        title: 'Refill Required',
        message: 'Wheat stock requires refill. Please schedule a refill.',
        read: false
      })
    ];
    await Notification.insertMany(adminNotifications);
    console.log('Notifications created');

    // Create Refills
    const refills = [
      new Refill({
        item: 'rice',
        quantity: 200,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed'
      }),
      new Refill({
        item: 'wheat',
        quantity: 100,
        date: new Date(),
        status: 'pending'
      })
    ];
    await Refill.insertMany(refills);
    console.log('Refills created');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
