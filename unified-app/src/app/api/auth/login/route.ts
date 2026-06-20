import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone number and password are required' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: `${phone}@oilfund.app`,
      password
    });

    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Invalid phone number or password' }, { status: 400 });
    }

    const userId = authData.user.id;

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    let profile = existingProfile;

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
        return NextResponse.json({ error: 'Failed to initialize your user profile' }, { status: 400 });
      }
      profile = inserted;
    }

    const token = jwt.sign({ id: profile.id, phone }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ session: { access_token: token, user: profile } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
