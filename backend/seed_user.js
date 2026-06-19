import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('mock-project')) {
  console.error("Error: Please make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your backend/.env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUser() {
  const phone = '7702858070';
  const email = `${phone}@oilfund.app`;
  const password = 'password123';
  const fullName = 'abhiram';

  console.log(`Attempting to register user: ${fullName} (${email})...`);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      console.log("User already exists in Supabase Auth. Proceeding to profile check...");
    } else {
      console.error("Signup failed:", signUpError.message);
      return;
    }
  }

  // Get user ID (either from signup or by signing in to retrieve it)
  let userId;
  if (signUpData?.user) {
    userId = signUpData.user.id;
  } else {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (signInError) {
      console.error("Failed to authenticate existing user to check profile:", signInError.message);
      return;
    }
    userId = signInData.user.id;
  }

  console.log(`User ID: ${userId}`);

  // Upsert profile row into profiles table in case trigger didn't fire
  console.log("Ensuring profiles row exists in PostgreSQL...");
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: fullName,
      phone: phone,
      referral_code: 'REF-ABHI',
      vip_level: 1,
      rank: 'Bronze Captain',
      balance: 10000.00,
      commission: 500.00
    })
    .select();

  if (profileError) {
    console.error("Failed to create profile row:", profileError.message);
  } else {
    console.log("Profile successfully seeded!", profile);
  }
}

seedUser();
