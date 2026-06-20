import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { full_name, phone, password, referred_by } = await req.json();

    if (!phone || !password || !full_name) {
      return NextResponse.json({ error: 'Full name, phone, and password are required' }, { status: 400 });
    }

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'User already registered' }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `${phone}@oilfund.app`,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone, referred_by }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
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
      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400 });
      profile = updated;
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
      if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 400 });
      profile = inserted;
    }

    const token = jwt.sign({ id: userId, phone }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      message: 'User registered successfully',
      session: { access_token: token, user: profile }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
