import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = authenticateUser(req);
    const { product_id, amount } = await req.json();

    if (!product_id || !amount) {
      return NextResponse.json({ error: 'Product ID and amount are required' }, { status: 400 });
    }

    const product = await db.products.get(product_id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (Number(amount) < Number(product.investment_amount)) {
      return NextResponse.json({ 
        error: `Minimum investment amount for this product is ₹${product.investment_amount}` 
      }, { status: 400 });
    }

    const profile = await db.profiles.get(user.id);
    if (Number(profile.balance) < Number(amount)) {
      return NextResponse.json({ error: 'Insufficient balance. Please recharge first.' }, { status: 400 });
    }

    // Deduct balance and update
    const updatedBalance = Number(profile.balance) - Number(amount);
    await db.profiles.update(user.id, { balance: updatedBalance });

    // Create investment
    const investment = await db.investments.create(user.id, product_id, amount);

    // Create transaction record
    await db.transactions.create(
      user.id,
      'withdraw', // debiting from balance to invest
      amount,
      `Invested in ${product.name}`,
      'approved'
    );

    return NextResponse.json({ 
      message: 'Investment completed successfully!', 
      investment,
      new_balance: updatedBalance
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
