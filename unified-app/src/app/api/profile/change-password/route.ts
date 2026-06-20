import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = authenticateUser(req);
    const { password } = await req.json();
    
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    await client.auth.setSession({ access_token: user.token, refresh_token: '' });
    const { error } = await client.auth.updateUser({ password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
