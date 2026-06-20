import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  referral_code: string;
  referred_by?: string;
  vip_level: number;
  rank: string;
  balance: number;
  commission: number;
  withdrawal_bank?: string;
  withdrawal_account?: string;
  withdrawal_ifsc?: string;
  withdrawal_holder?: string;
  withdrawal_name?: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string;
  term_days: number;
  quantity_limit: number;
  daily_income_rate: number;
  total_income: number;
  investment_amount: number;
  stock_percentage: number;
  is_active: boolean;
}

interface Investment {
  id: string;
  product_id: string;
  amount: number;
  daily_income: number;
  total_income: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  product?: Product;
}

interface Transaction {
  id: string;
  type: 'recharge' | 'withdraw' | 'income' | 'commission' | 'bonus';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  note: string;
  created_at: string;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface AppState {
  token: string | null;
  user: UserProfile | null;
  products: Product[];
  investments: Investment[];
  transactions: Transaction[];
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;

  setToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  fetchProfile: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (fullName: string, phone: string, password: string, referredBy?: string) => Promise<boolean>;
  invest: (productId: string, amount: number) => Promise<boolean>;
  recharge: (amount: number, method: string) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
  updateWithdrawalAccount: (bank: string, number: string, ifsc: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      products: [],
      investments: [],
      transactions: [],
      notifications: [],
      isLoading: false,
      error: null,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),

      fetchProfile: async () => {
        console.log("[Zustand Store] Fetching profile...");
        try {
          const response = await api.get('/profile/me');
          console.log("[Zustand Store] Profile Fetch Success:", response.data);
          set({ user: response.data.profile });
        } catch (err: any) {
          console.error("[Zustand Store] Profile Fetch Error:", err.message);
          set({ error: err.response?.data?.error || 'Failed to fetch profile' });
        }
      },

      fetchProducts: async () => {
        console.log("[Zustand Store] Fetching products...");
        try {
          const response = await api.get('/products');
          console.log("[Zustand Store] Products Fetch Success: Loaded", response.data?.products?.length, "products.");
          set({ products: response.data.products });
        } catch (err: any) {
          console.error("[Zustand Store] Products Fetch Error:", err.message);
          set({ error: err.response?.data?.error || 'Failed to fetch products' });
        }
      },

      fetchInvestments: async () => {
        try {
          const response = await api.get('/investments/my');
          set({ investments: response.data.investments });
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Failed to fetch investments' });
        }
      },

      fetchTransactions: async () => {
        try {
          const response = await api.get('/transactions/history');
          set({ transactions: response.data.history });
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Failed to fetch transaction history' });
        }
      },

      fetchNotifications: async () => {
        try {
          const response = await api.get('/notifications');
          set({ notifications: response.data.notifications });
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Failed to fetch notifications' });
        }
      },

      markNotificationRead: async (id) => {
        try {
          await api.put(`/notifications/${id}/read`);
          await get().fetchNotifications();
        } catch (err: any) {
          console.error('Failed to mark notification as read:', err);
        }
      },

      login: async (phone, password) => {
        set({ isLoading: true, error: null });
        console.log("[Zustand Store] Initiating Login for:", phone);
        try {
          const response = await api.post('/auth/login', { phone, password });
          console.log("[Zustand Store] Login Response Success:", response.data);
          const { access_token, user } = response.data.session;
          set({ token: access_token, isLoading: false });
          await get().fetchProfile();
          return true;
        } catch (err: any) {
          console.error("[Zustand Store] Login Error:", err.message);
          set({ error: err.response?.data?.error || 'Login failed', isLoading: false });
          return false;
        }
      },

      register: async (fullName, phone, password, referredBy) => {
        set({ isLoading: true, error: null });
        console.log("[Zustand Store] Initiating Registration for:", phone, fullName);
        try {
          const response = await api.post('/auth/register', { 
            full_name: fullName, 
            phone, 
            password, 
            referred_by: referredBy 
          });
          console.log("[Zustand Store] Register Response Success:", response.data);
          const { access_token } = response.data.session;
          set({ token: access_token, isLoading: false });
          await get().fetchProfile();
          return true;
        } catch (err: any) {
          console.error("[Zustand Store] Register Error:", err.message);
          set({ error: err.response?.data?.error || 'Registration failed', isLoading: false });
          return false;
        }
      },

      invest: async (productId, amount) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/investments/create', { product_id: productId, amount });
          await get().fetchProfile();
          await get().fetchInvestments();
          await get().fetchTransactions();
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Investment failed', isLoading: false });
          return false;
        }
      },

      recharge: async (amount, method) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/transactions/recharge', { amount, payment_method: method });
          await get().fetchProfile();
          await get().fetchTransactions();
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Recharge failed', isLoading: false });
          return false;
        }
      },

      withdraw: async (amount) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/transactions/withdraw', { amount });
          await get().fetchProfile();
          await get().fetchTransactions();
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Withdrawal failed', isLoading: false });
          return false;
        }
      },

      updateWithdrawalAccount: async (bank, number, ifsc, name) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/profile/withdrawal-account', {
            bank_name: bank,
            account_number: number,
            ifsc_code: ifsc,
            holder_name: name
          });
          await get().fetchProfile();
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error || 'Failed to update account details', isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ token: null, user: null, investments: [], transactions: [], notifications: [] });
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
