import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = authenticateUser(req);
    const { amount } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const profile = await db.profiles.get(user.id);

    if (!profile.withdrawal_account) {
      return NextResponse.json({ 
        error: 'Please bind your withdrawal account first in your Profile.' 
      }, { status: 400 });
    }

    if (Number(profile.balance) < Number(amount)) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const newBalance = Number(profile.balance) - Number(amount);

    // Update user balance
    await db.profiles.update(user.id, { balance: newBalance });

    // Save transaction
    const tx = await db.transactions.create(
      user.id,
      'withdraw',
      amount,
      `Withdrawal to bank account ending in ${profile.withdrawal_account.slice(-4)}`,
      'pending'
    );

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully!',
      transaction: tx,
      new_balance: newBalance
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
