import Inventory from '../models/Inventory.js';
import Notification from '../models/Notification.js';

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { currentStock, minimumStock } = req.body;
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        currentStock,
        minimumStock,
        status: currentStock < minimumStock ? 'critical' : currentStock < minimumStock * 1.5 ? 'low' : 'normal',
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Create notification if critical
    if (inventory.status === 'critical') {
      const notification = new Notification({
        userId: null,
        type: 'low_stock_alert',
        title: 'Critical Stock Alert',
        message: `${inventory.item} stock is critically low. Current: ${inventory.currentStock} kg`
      });
      await notification.save();
    }

    res.json({ message: 'Inventory updated', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory', error: error.message });
  }
};

export const simulateLowStock = async (req, res) => {
  try {
    const { item } = req.body;
    const inventory = await Inventory.findOne({ item });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    inventory.currentStock = inventory.minimumStock * 0.5;
    inventory.status = 'critical';
    await inventory.save();

    const notification = new Notification({
      userId: null,
      type: 'low_stock_alert',
      title: 'Critical Stock Alert',
      message: `${item} stock is critically low. Current: ${inventory.currentStock} kg`
    });
    await notification.save();

    res.json({ message: 'Low stock simulated', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating low stock', error: error.message });
  }
};
