import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = authenticateUser(req);
    const { amount, payment_method } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const profile = await db.profiles.get(user.id);
    const newBalance = Number(profile.balance) + Number(amount);

    // Update balance
    await db.profiles.update(user.id, { balance: newBalance });

    // Save transaction
    const tx = await db.transactions.create(
      user.id,
      'recharge',
      amount,
      `Recharged via ${payment_method || 'UPI'}`,
      'approved'
    );

    return NextResponse.json({
      message: 'Recharge completed successfully!',
      transaction: tx,
      new_balance: newBalance
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
