import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(req: Request) {
  try {
    const user = authenticateUser(req);
    const updates = await req.json();
    
    const profile = await db.profiles.update(user.id, updates);

    // If full_name is updated, also update auth metadata
    if (updates.full_name) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
      const client = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
      });
      await client.auth.setSession({ access_token: user.token, refresh_token: '' });
      await client.auth.updateUser({ data: { full_name: updates.full_name } });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
