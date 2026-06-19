import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', async (req, res, next) => {
  try {
    const notifications = await db.notifications.listForUser(req.user.id);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    const updated = await db.notifications.markAsRead(req.params.id);
    res.json({ success: true, notification: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
