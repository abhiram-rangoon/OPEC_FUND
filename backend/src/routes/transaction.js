import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/history', async (req, res, next) => {
  try {
    const history = await db.transactions.listForUser(req.user.id);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

router.post('/recharge', async (req, res, next) => {
  try {
    const { amount, payment_method } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const profile = await db.profiles.get(req.user.id);
    const newBalance = Number(profile.balance) + Number(amount);

    // Update balance
    await db.profiles.update(req.user.id, { balance: newBalance });

    // Save transaction
    const tx = await db.transactions.create(
      req.user.id,
      'recharge',
      amount,
      `Recharged via ${payment_method || 'UPI'}`,
      'approved'
    );

    res.json({
      message: 'Recharge completed successfully!',
      transaction: tx,
      new_balance: newBalance
    });
  } catch (error) {
    next(error);
  }
});

router.post('/withdraw', async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const profile = await db.profiles.get(req.user.id);

    if (!profile.withdrawal_account) {
      return res.status(400).json({ 
        error: 'Please bind your withdrawal account first in your Profile.' 
      });
    }

    if (Number(profile.balance) < Number(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBalance = Number(profile.balance) - Number(amount);

    // Update user balance
    await db.profiles.update(req.user.id, { balance: newBalance });

    // Save transaction
    const tx = await db.transactions.create(
      req.user.id,
      'withdraw',
      amount,
      `Withdrawal to bank account ending in ${profile.withdrawal_account.slice(-4)}`,
      'pending'
    );

    res.json({
      message: 'Withdrawal request submitted successfully!',
      transaction: tx,
      new_balance: newBalance
    });
  } catch (error) {
    next(error);
  }
});

export default router;
