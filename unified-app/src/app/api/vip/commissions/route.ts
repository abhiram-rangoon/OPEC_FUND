import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = authenticateUser(req);
    const profile = await db.profiles.get(user.id);
    return NextResponse.json({
      commissions_earned: profile.commission || 0.00
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
