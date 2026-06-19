import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { db, isSupabaseConfigured } from '../services/db.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/me', async (req, res, next) => {
  try {
    const profile = await db.profiles.get(req.user.id, req.user);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    const { full_name } = req.body;
    const profile = await db.profiles.update(req.user.id, { full_name });

    // Synchronize full_name in Supabase Auth user_metadata
    if (isSupabaseConfigured()) {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      if (!token.startsWith('mock-jwt-token-')) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-key';
        const client = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false }
        });
        await client.auth.setSession({ access_token: token, refresh_token: '' });
        await client.auth.updateUser({ data: { full_name } });
      }
    }

    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

router.post('/withdrawal-account', async (req, res, next) => {
  try {
    const { bank_name, account_number, ifsc_code, holder_name } = req.body;
    
    if (!bank_name || !account_number || !ifsc_code || !holder_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const profile = await db.profiles.update(req.user.id, {
      withdrawal_bank: bank_name,
      withdrawal_account: account_number,
      withdrawal_ifsc: ifsc_code,
      withdrawal_holder: holder_name
    });

    res.json({ message: 'Withdrawal account updated successfully', profile });
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (isSupabaseConfigured()) {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      
      // If we are in mock mode we skip Supabase direct API call
      if (!token.startsWith('mock-jwt-token-')) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-key';
        const client = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false }
        });
        
        await client.auth.setSession({ access_token: token, refresh_token: '' });
        const { error } = await client.auth.updateUser({ password });
        if (error) return res.status(400).json({ error: error.message });
      }
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
