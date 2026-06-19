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

const initialProducts = [
  { name: 'Majnuen Oilfield (Phase III)', term_days: 7, quantity_limit: 1, daily_income_rate: 5.00, total_income: 1890.00, investment_amount: 1400.00, stock_percentage: 60.98, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
  { name: 'Phase II of the Hasi Mesaude Oilfield', term_days: 18, quantity_limit: 1, daily_income_rate: 3.50, total_income: 4564.00, investment_amount: 2800.00, stock_percentage: 40.32, image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80' },
  { name: 'Halfaya Oilfield Phase II', term_days: 35, quantity_limit: 1, daily_income_rate: 3.00, total_income: 11890.00, investment_amount: 5800.00, stock_percentage: 66.08, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
  { name: 'Zakum Oilfield', term_days: 65, quantity_limit: 2, daily_income_rate: 2.30, total_income: 36926.00, investment_amount: 14800.00, stock_percentage: 71.52, image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80' },
  { name: 'El Mero oil field', term_days: 270, quantity_limit: 3, daily_income_rate: 2.00, total_income: 166400.00, investment_amount: 26000.00, stock_percentage: 78.76, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
  { name: 'Maracaibo Basin', term_days: 320, quantity_limit: 3, daily_income_rate: 2.10, total_income: 293360.00, investment_amount: 38000.00, stock_percentage: 67.06, image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80' },
  { name: 'Ghavar oil field', term_days: 350, quantity_limit: 5, daily_income_rate: 2.20, total_income: 452400.00, investment_amount: 52000.00, stock_percentage: 64.19, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' }
];

async function seedProducts() {
  console.log("Checking products table...");
  
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id');

  if (fetchError) {
    console.error("Error checking products table. Does the products table exist in your database yet? Error:", fetchError.message);
    console.log("Please run the schema.sql in your Supabase SQL editor first.");
    return;
  }

  if (existingProducts && existingProducts.length > 0) {
    console.log(`The products table already has ${existingProducts.length} entries. Seeding skipped.`);
    return;
  }

  console.log("Seeding products...");
  const { data: inserted, error: insertError } = await supabase
    .from('products')
    .insert(initialProducts)
    .select();

  if (insertError) {
    console.error("Failed to seed products:", insertError.message);
  } else {
    console.log(`Success! Seeded ${inserted.length} investment products.`);
  }
}

seedProducts();
