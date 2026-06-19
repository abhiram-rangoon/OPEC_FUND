import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/my', async (req, res, next) => {
  try {
    const investments = await db.investments.listForUser(req.user.id);
    res.json({ investments });
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const { product_id, amount } = req.body;

    if (!product_id || !amount) {
      return res.status(400).json({ error: 'Product ID and amount are required' });
    }

    const product = await db.products.get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (Number(amount) < Number(product.investment_amount)) {
      return res.status(400).json({ 
        error: `Minimum investment amount for this product is ₹${product.investment_amount}` 
      });
    }

    const profile = await db.profiles.get(req.user.id);
    if (Number(profile.balance) < Number(amount)) {
      return res.status(400).json({ error: 'Insufficient balance. Please recharge first.' });
    }

    // Deduct balance and update
    const updatedBalance = Number(profile.balance) - Number(amount);
    await db.profiles.update(req.user.id, { balance: updatedBalance });

    // Create investment
    const investment = await db.investments.create(req.user.id, product_id, amount);

    // Create transaction record
    await db.transactions.create(
      req.user.id,
      'withdraw', // debiting from balance to invest
      amount,
      `Invested in ${product.name}`,
      'approved'
    );

    res.json({ 
      message: 'Investment completed successfully!', 
      investment,
      new_balance: updatedBalance
    });
  } catch (error) {
    next(error);
  }
});

export default router;
