import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = authenticateUser(req);
    const profile = await db.profiles.get(user.id);
    return NextResponse.json({
      current_rank: profile.rank,
      vip_level: profile.vip_level,
      rules: [
        { name: 'Rookie Captain', threshold: 0, commission: '0%' },
        { name: 'Bronze Captain', threshold: 50000, commission: '5%' },
        { name: 'Silver Captain', threshold: 100000, commission: '10%' },
        { name: 'Gold Captain', threshold: 150000, commission: '15%' },
        { name: 'Platinum Partner', threshold: 200000, commission: '20%' },
        { name: 'Diamond Partner', threshold: 250000, commission: '25%' }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
