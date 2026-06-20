import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = authenticateUser(req);
    const investments = await db.investments.listForUser(user.id);
    return NextResponse.json({ investments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
