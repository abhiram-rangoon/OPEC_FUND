import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkProfiles() {
  console.log("Fetching profiles from Supabase database...");
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  if (error) {
    console.error("Error fetching profiles:", error.message);
    return;
  }

  console.log("Profiles in Database (First 5):");
  console.log(JSON.stringify(data, null, 2));
}

checkProfiles();
