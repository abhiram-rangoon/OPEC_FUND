-- Database schema for OilFund (Premium Green theme redesign)

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  vip_level INT DEFAULT 0,
  rank TEXT DEFAULT 'Rookie Captain',
  balance DECIMAL(12, 2) DEFAULT 0.00,
  commission DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Investment Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  term_days INT NOT NULL,
  quantity_limit INT DEFAULT 1,
  daily_income_rate DECIMAL(5, 2) NOT NULL, -- e.g., 5.00 for 5%
  total_income DECIMAL(12, 2) NOT NULL,
  investment_amount DECIMAL(12, 2) NOT NULL,
  stock_percentage DECIMAL(5, 2) DEFAULT 100.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Investments Table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  daily_income DECIMAL(12, 2) NOT NULL,
  total_income DECIMAL(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'expired')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('recharge', 'withdraw', 'income', 'commission', 'bonus')) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  level INT CHECK (level IN (1, 2, 3)) NOT NULL,
  commission_earned DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers to automate profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, referral_code, referred_by, balance, commission)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.phone,
    substring(md5(random()::text) from 1 for 8),
    new.raw_user_meta_data->>'referred_by',
    0.00,
    0.00
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed initial products
INSERT INTO products (name, term_days, quantity_limit, daily_income_rate, total_income, investment_amount, stock_percentage, image_url)
VALUES 
('Majnuen Oilfield (Phase III)', 7, 1, 5.00, 1890.00, 1400.00, 60.98, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'),
('Phase II of the Hasi Mesaude Oilfield', 18, 1, 3.50, 4564.00, 2800.00, 40.32, 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80'),
('Halfaya Oilfield Phase II', 35, 1, 3.00, 11890.00, 5800.00, 66.08, 'https://images.unsplash.com/photo-1518709768805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'),
('Zakum Oilfield', 65, 2, 2.30, 36926.00, 14800.00, 71.52, 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80'),
('El Mero oil field', 270, 3, 2.00, 166400.00, 26000.00, 78.76, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'),
('Maracaibo Basin', 320, 3, 2.10, 293360.00, 38000.00, 67.06, 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80'),
('Ghavar oil field', 350, 5, 2.20, 452400.00, 52000.00, 64.19, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80')
ON CONFLICT DO NOTHING;
