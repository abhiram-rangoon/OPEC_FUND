import { supabase } from './supabase.js';

// In-Memory state for fallback when Supabase is not reachable
export const mockDb = {
  profiles: new Map(),
  products: new Map(),
  investments: new Map(),
  transactions: new Map(),
  referrals: new Map(),
  notifications: new Map()
};

// Seed Mock Products
const mockProductsList = [
  { id: '1', name: 'Majnuen Oilfield (Phase III)', term_days: 7, quantity_limit: 1, daily_income_rate: 5.00, total_income: 1890.00, investment_amount: 1400.00, stock_percentage: 60.98, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Phase II of the Hasi Mesaude Oilfield', term_days: 18, quantity_limit: 1, daily_income_rate: 3.50, total_income: 4564.00, investment_amount: 2800.00, stock_percentage: 40.32, image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80' },
  { id: '3', name: 'Halfaya Oilfield Phase II', term_days: 35, quantity_limit: 1, daily_income_rate: 3.00, total_income: 11890.00, investment_amount: 5800.00, stock_percentage: 66.08, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
  { id: '4', name: 'Zakum Oilfield', term_days: 65, quantity_limit: 2, daily_income_rate: 2.30, total_income: 36926.00, investment_amount: 14800.00, stock_percentage: 71.52, image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80' },
  { id: '5', name: 'El Mero oil field', term_days: 270, quantity_limit: 3, daily_income_rate: 2.00, total_income: 166400.00, investment_amount: 26000.00, stock_percentage: 78.76, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
  { id: '6', name: 'Maracaibo Basin', term_days: 320, quantity_limit: 3, daily_income_rate: 2.10, total_income: 293360.00, investment_amount: 38000.00, stock_percentage: 67.06, image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80' },
  { id: '7', name: 'Ghavar oil field', term_days: 350, quantity_limit: 5, daily_income_rate: 2.20, total_income: 452400.00, investment_amount: 52000.00, stock_percentage: 64.19, image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' }
];

mockProductsList.forEach(p => mockDb.products.set(p.id, p));

export const isSupabaseConfigured = () => {
  return process.env.SUPABASE_URL && 
         process.env.SUPABASE_URL !== 'https://mock-project.supabase.co' && 
         process.env.SUPABASE_ANON_KEY && 
         process.env.SUPABASE_ANON_KEY !== 'mock-key';
};

// Database operation wrapper
export const db = {
  profiles: {
    async get(id, userAuth = null) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (!error && data) {
          // Self-heal phone or name if missing in database row
          const authPhone = userAuth?.phone || userAuth?.user_metadata?.phone;
          const authName = userAuth?.user_metadata?.full_name;
          const updates = {};
          let needsUpdate = false;

          if (!data.phone && authPhone) {
            updates.phone = authPhone;
            needsUpdate = true;
          }
          if ((!data.full_name || data.full_name === 'User') && authName) {
            updates.full_name = authName;
            needsUpdate = true;
          }

          if (needsUpdate) {
            const { data: updated } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
            if (updated) return updated;
          }
          return data;
        }

        // Self-healing fallback if profile row does not exist in the database
        if (error || !data) {
          const fullName = userAuth?.user_metadata?.full_name || 'Premium Member';
          const phone = userAuth?.phone || userAuth?.user_metadata?.phone || ('77' + Math.floor(10000000 + Math.random() * 90000000));
          
          const newProfile = {
            id,
            full_name: fullName,
            phone: phone,
            referral_code: 'REF-' + id.substring(0, 4).toUpperCase(),
            referred_by: userAuth?.user_metadata?.referred_by || null,
            vip_level: 0,
            rank: 'Rookie Captain',
            balance: 0.00,
            commission: 0.00
          };

          const { data: inserted, error: insertErr } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (!insertErr && inserted) return inserted;
          console.error("Self-healing profile creation failed:", insertErr);
        }
      }
      if (!mockDb.profiles.has(id)) {
        mockDb.profiles.set(id, {
          id,
          full_name: userAuth?.user_metadata?.full_name || 'Premium Member',
          phone: userAuth?.phone || userAuth?.user_metadata?.phone || '7702858070',
          referral_code: 'REF-' + id.substring(0, 4).toUpperCase(),
          referred_by: userAuth?.user_metadata?.referred_by || null,
          vip_level: 0,
          rank: 'Rookie Captain',
          balance: 0.00,
          commission: 0.00,
          created_at: new Date()
        });
      }
      return mockDb.profiles.get(id);
    },
    async update(id, updates) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
        if (!error && data) return data;
      }
      const existing = await this.get(id);
      const updated = { ...existing, ...updates };
      mockDb.profiles.set(id, updated);
      return updated;
    }
  },
  products: {
    async list() {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.error("[Database Service] Error listing products from Supabase:", error.message);
        } else if (data) {
          return data;
        }
      }
      return Array.from(mockDb.products.values());
    },
    async get(id) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (!error && data) return data;
      }
      return mockDb.products.get(id);
    }
  },
  investments: {
    async listForUser(userId) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('investments').select('*, products(*)').eq('user_id', userId);
        if (!error && data) return data;
      }
      return Array.from(mockDb.investments.values()).filter(inv => inv.user_id === userId);
    },
    async create(userId, productId, amount) {
      const product = await db.products.get(productId);
      if (!product) throw new Error('Product not found');

      const term = product.term_days;
      const dailyRate = product.daily_income_rate / 100;
      const dailyIncome = Number((amount * dailyRate).toFixed(2));
      const totalIncome = Number((dailyIncome * term).toFixed(2));

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + term);

      const investment = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: userId,
        product_id: productId,
        amount: Number(amount),
        daily_income: dailyIncome,
        total_income: totalIncome,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        created_at: new Date().toISOString(),
        product // Include product details
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('investments').insert({
          user_id: userId,
          product_id: productId,
          amount,
          daily_income: dailyIncome,
          total_income: totalIncome,
          start_date: investment.start_date,
          end_date: investment.end_date,
          status: 'active'
        }).select().single();
        if (!error && data) return data;
      }

      mockDb.investments.set(investment.id, investment);
      return investment;
    }
  },
  transactions: {
    async listForUser(userId) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (!error && data) return data;
      }
      return Array.from(mockDb.transactions.values())
        .filter(t => t.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    async create(userId, type, amount, note = '', status = 'approved') {
      const tx = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: userId,
        type,
        amount: Number(amount),
        status,
        note,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('transactions').insert(tx).select().single();
        if (!error && data) return data;
      }

      mockDb.transactions.set(tx.id, tx);
      return tx;
    }
  },
  referrals: {
    async listTeam(userId) {
      if (isSupabaseConfigured()) {
        // Query active referral tree
        const { data, error } = await supabase.from('referrals').select('*, profiles!referrals_referred_id_fkey(*)').eq('referrer_id', userId);
        if (!error && data) return data;
      }
      // Simple mock team list
      return [
        { id: 'ref1', referrer_id: userId, referred_id: 'sub1', level: 1, commission_earned: 98.00, mobile: '77****8123', full_name: 'Rahul Roy' },
        { id: 'ref2', referrer_id: userId, referred_id: 'sub2', level: 2, commission_earned: 45.00, mobile: '89****9012', full_name: 'Anita Sen' },
        { id: 'ref3', referrer_id: userId, referred_id: 'sub3', level: 3, commission_earned: 15.00, mobile: '91****3456', full_name: 'Vikram Das' }
      ];
    }
  },
  notifications: {
    async listForUser(userId) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (!error && data) return data;
      }
      if (mockDb.notifications.size === 0) {
        // Seed default notification
        const defaultNotif = {
          id: 'n1',
          user_id: userId,
          title: 'Welcome to OilFund',
          message: 'Welcome to OPEC Oil Fund. Invest in clean energy & oil reserves to unlock premium daily income benefits.',
          is_read: false,
          created_at: new Date().toISOString()
        };
        mockDb.notifications.set(defaultNotif.id, defaultNotif);
      }
      return Array.from(mockDb.notifications.values()).filter(n => n.user_id === userId);
    },
    async markAsRead(id) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id).select().single();
        if (!error && data) return data;
      }
      const existing = mockDb.notifications.get(id);
      if (existing) {
        existing.is_read = true;
        mockDb.notifications.set(id, existing);
      }
      return existing;
    }
  }
};
