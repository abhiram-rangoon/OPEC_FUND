import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabase.js';
import { db, isSupabaseConfigured } from '../services/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-oilfund-key-2026';

router.post('/register', async (req, res, next) => {
  try {
    const { full_name, phone, password, referred_by } = req.body;

    if (!phone || !password || !full_name) {
      return res.status(400).json({ error: 'Full name, phone, and password are required' });
    }

    if (isSupabaseConfigured()) {
      // 1. Check if user already exists in profiles table
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ error: 'User already registered' });
      }

      // 2. Create the auth user credentials via Supabase Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${phone}@oilfund.app`,
        password,
        email_confirm: true,
        user_metadata: { full_name, phone, referred_by }
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      const userId = authData.user.id;
      const referralCode = 'REF-' + userId.substring(0, 4).toUpperCase();
      const profileData = {
        id: userId,
        full_name,
        phone,
        referral_code: referralCode,
        referred_by: referred_by || null,
        balance: 0.00,
        commission: 0.00
      };

      // 3. Insert or update the profile row directly (bypassing triggers & RLS)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let profile;
      if (existingProfile) {
        const { data: updated, error: updateErr } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId)
          .select()
          .single();
        if (updateErr) return res.status(400).json({ error: updateErr.message });
        profile = updated;
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        if (insertErr) return res.status(400).json({ error: insertErr.message });
        profile = inserted;
      }

      // 4. Sign a custom JWT token
      const token = jwt.sign({ id: userId, phone }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        message: 'User registered successfully',
        session: {
          access_token: token,
          user: profile
        }
      });
    }

    // Fallback: mock success (for offline development)
    const mockUserId = 'usr_' + Math.random().toString(36).substring(2, 10);
    const mockUser = {
      id: mockUserId,
      full_name,
      phone,
      referral_code: 'REF-' + mockUserId.substring(4, 8).toUpperCase(),
      referred_by,
      vip_level: 0,
      rank: 'Rookie Captain',
      balance: 0.00,
      commission: 0.00,
      created_at: new Date()
    };
    db.profiles.update(mockUserId, mockUser);
    const token = jwt.sign({ id: mockUserId, phone }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'User registered successfully (Demo Mode)',
      session: {
        access_token: token,
        user: mockUser
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    if (isSupabaseConfigured()) {
      // 1. Authenticate the credentials using a transient Supabase client to avoid session pollution on the shared client
      const { createClient } = await import('@supabase/supabase-js');
      const authClient = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );

      const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
        email: `${phone}@oilfund.app`,
        password
      });

      if (authError || !authData?.user) {
        return res.status(400).json({ error: 'Invalid phone number or password' });
      }

      const userId = authData.user.id;

      // 2. Fetch the user profile (bypassing RLS via admin client)
      const { data: existingProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let profile = existingProfile;

      // Self-heal/upsert profile row if it doesn't exist in the database profiles table
      if (!profile) {
        const referralCode = 'REF-' + userId.substring(0, 4).toUpperCase();
        const newProfile = {
          id: userId,
          full_name: authData.user.user_metadata?.full_name || 'Premium Member',
          phone: phone,
          referral_code: referralCode,
          referred_by: authData.user.user_metadata?.referred_by || null,
          vip_level: 0,
          rank: 'Rookie Captain',
          balance: 0.00,
          commission: 0.00
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertErr) {
          console.error("Self-healing profile creation on login failed:", insertErr.message);
          return res.status(400).json({ error: 'Failed to initialize your user profile' });
        }
        profile = inserted;
      }

      // 3. Issue our own signed JWT token
      const token = jwt.sign({ id: profile.id, phone }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        session: {
          access_token: token,
          user: profile
        }
      });
    }

    // Fallback: mock login
    let matchedUserId = 'demo-user-id';
    if (phone === '7702858070') {
      matchedUserId = 'usr_7702858070';
    }
    const userProfile = await db.profiles.get(matchedUserId);
    userProfile.phone = phone;

    const token = jwt.sign({ id: matchedUserId, phone }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      session: {
        access_token: token,
        user: userProfile
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
