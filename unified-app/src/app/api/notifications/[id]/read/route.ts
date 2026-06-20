import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    authenticateUser(req);
    const { id } = await params;
    const updated = await db.notifications.markAsRead(id);
    return NextResponse.json({ success: true, notification: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
