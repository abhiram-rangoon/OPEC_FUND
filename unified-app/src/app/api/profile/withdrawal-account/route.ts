import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = authenticateUser(req);
    const { bank_name, account_number, ifsc_code, holder_name } = await req.json();
    
    if (!bank_name || !account_number || !ifsc_code || !holder_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const profile = await db.profiles.update(user.id, {
      withdrawal_bank: bank_name,
      withdrawal_account: account_number,
      withdrawal_ifsc: ifsc_code,
      withdrawal_holder: holder_name
    });

    return NextResponse.json({ message: 'Withdrawal account updated successfully', profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
