import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = authenticateUser(req);
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Bonus code is required' }, { status: 400 });
    }

    // Mock bonus logic: if code starts with BONUS, give amount based on number at end. Or WELCOME50
    let amount = 0;
    if (code.toUpperCase() === 'WELCOME50') {
      amount = 50;
    } else if (code.toUpperCase().startsWith('BONUS')) {
      const match = code.match(/\d+$/);
      if (match) amount = parseInt(match[0], 10);
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid or expired bonus code' }, { status: 400 });
    }

    // Check if code already used (optional, normally you'd check a bonus_codes table)
    // For now just create a bonus transaction and update profile balance
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
    if (!profile) throw new Error('Profile not found');

    const newBalance = profile.balance + amount;

    await db.transactions.create(user.id, 'bonus', amount, `Bonus Code: ${code.toUpperCase()}`, 'approved');
    await db.profiles.update(user.id, { balance: newBalance });

    return NextResponse.json({ success: true, amount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
