import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = authenticateUser(req);
    const teamList = await db.referrals.listTeam(user.id);
    
    const levelA = teamList.filter((t: any) => t.level === 1);
    const levelB = teamList.filter((t: any) => t.level === 2);
    const levelC = teamList.filter((t: any) => t.level === 3);

    return NextResponse.json({
      team: { levelA, levelB, levelC }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
