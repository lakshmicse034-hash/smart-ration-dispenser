import Refill from '../models/Refill.js';
import Inventory from '../models/Inventory.js';
import Notification from '../models/Notification.js';

export const getRefills = async (req, res) => {
  try {
    const refills = await Refill.find().sort({ date: -1 });
    res.json(refills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching refills', error: error.message });
  }
};

export const createRefill = async (req, res) => {
  try {
    const { item, quantity } = req.body;

    const refill = new Refill({
      item,
      quantity,
      status: 'pending'
    });

    await refill.save();

    const notification = new Notification({
      userId: null,
      type: 'refill_generated',
      title: 'Refill Generated',
      message: `Refill request for ${item}: ${quantity} kg created.`
    });
    await notification.save();

    res.json({ message: 'Refill created', refill });
  } catch (error) {
    res.status(500).json({ message: 'Error creating refill', error: error.message });
  }
};

export const updateRefill = async (req, res) => {
  try {
    const { status } = req.body;
    const refill = await Refill.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!refill) {
      return res.status(404).json({ message: 'Refill not found' });
    }

    // If completed, update inventory
    if (status === 'completed') {
      const inventory = await Inventory.findOne({ item: refill.item });
      if (inventory) {
        inventory.currentStock += refill.quantity;
        inventory.status = 'normal';
        await inventory.save();
      }
    }

    res.json({ message: 'Refill updated', refill });
  } catch (error) {
    res.status(500).json({ message: 'Error updating refill', error: error.message });
  }
};
