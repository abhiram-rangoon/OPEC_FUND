import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { db } from '../services/db.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/my-team', async (req, res, next) => {
  try {
    const teamList = await db.referrals.listTeam(req.user.id);
    
    // Group team members by level A (Level 1), B (Level 2), C (Level 3)
    const levelA = teamList.filter(t => t.level === 1);
    const levelB = teamList.filter(t => t.level === 2);
    const levelC = teamList.filter(t => t.level === 3);

    res.json({
      team: {
        levelA,
        levelB,
        levelC
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/commissions', async (req, res, next) => {
  try {
    const profile = await db.profiles.get(req.user.id);
    res.json({
      commissions_earned: profile.commission || 0.00
    });
  } catch (error) {
    next(error);
  }
});

router.get('/rank', async (req, res, next) => {
  try {
    const profile = await db.profiles.get(req.user.id);
    res.json({
      current_rank: profile.rank,
      vip_level: profile.vip_level,
      rules: [
        { name: 'Rookie Captain', threshold: 0, commission: '0%' },
        { name: 'Bronze Captain', threshold: 50000, commission: '5%' },
        { name: 'Silver Captain', threshold: 100000, commission: '10%' },
        { name: 'Gold Captain', threshold: 150000, commission: '15%' },
        { name: 'Platinum Partner', threshold: 200000, commission: '20%' },
        { name: 'Diamond Partner', threshold: 250000, commission: '25%' }
      ]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
