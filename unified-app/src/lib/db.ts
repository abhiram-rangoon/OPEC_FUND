import { supabase } from '@/lib/supabase';

// Database operation wrapper
export const db = {
  profiles: {
    async get(id: string, userAuth: any = null) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (!error && data) {
        // Self-heal phone or name if missing in database row
        const authPhone = userAuth?.phone || userAuth?.user_metadata?.phone;
        const authName = userAuth?.user_metadata?.full_name;
        const updates: any = {};
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
        throw new Error('Profile not found and could not be created');
      }
    },
    async update(id: any, updates: any) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }
  },
  products: {
    async list() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
    async get(id: any) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    }
  },
  investments: {
    async listForUser(userId: any) {
      const { data, error } = await supabase.from('investments').select('*, products(*)').eq('user_id', userId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    async create(userId: any, productId: any, amount: any) {
      const product = await db.products.get(productId);
      if (!product) throw new Error('Product not found');

      const term = product.term_days;
      const dailyRate = product.daily_income_rate / 100;
      const dailyIncome = Number((amount * dailyRate).toFixed(2));
      const totalIncome = Number((dailyIncome * term).toFixed(2));

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + term);

      const { data, error } = await supabase.from('investments').insert({
        user_id: userId,
        product_id: productId,
        amount,
        daily_income: dailyIncome,
        total_income: totalIncome,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active'
      }).select().single();
      
      if (error) throw new Error(error.message);
      return data;
    }
  },
  transactions: {
    async listForUser(userId: any) {
      const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
    async create(userId: any, type: any, amount: any, note: any = '', status: any = 'approved') {
      const tx = {
        user_id: userId,
        type,
        amount: Number(amount),
        status,
        note,
      };

      const { data, error } = await supabase.from('transactions').insert(tx).select().single();
      if (error) throw new Error(error.message);
      return data;
    }
  },
  referrals: {
    async listTeam(userId: any) {
      // Query active referral tree
      const { data, error } = await supabase.from('referrals').select('*, profiles!referrals_referred_id_fkey(*)').eq('referrer_id', userId);
      if (error) throw new Error(error.message);
      return data || [];
    }
  },
  notifications: {
    async listForUser(userId: any) {
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
    async markAsRead(id: any) {
      const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }
  }
};
