'use client';
import React, { useEffect, useState } from 'react';
import { Clock, Users, TrendingUp, Wallet, X } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';

export default function ProjectsScreen() {
  const products = useAppStore((state) => state.products);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const investAction = useAppStore((state) => state.invest);
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  
  const [filterTab, setFilterTab] = useState<'on_sale' | 'sold_out'>('on_sale');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProducts();
      await fetchProfile();
      setLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchProfile]);

  const filteredProducts = products.filter(p => {
    if (filterTab === 'on_sale') {
      return p.stock_percentage > 0;
    } else {
      return p.stock_percentage <= 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F0FBF7] pb-24 relative overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="bg-[#007A5E] pt-12 pb-5 flex justify-center sticky top-0 z-20 shadow-md">
        <h1 className="text-xl font-bold text-white">Investment Projects</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-[#00C896]/10 px-5 py-2 sticky top-[76px] z-20 shadow-sm">
        <button 
          onClick={() => setFilterTab('on_sale')} 
          className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${filterTab === 'on_sale' ? 'bg-[#E6FFF7] text-[#00C896]' : 'text-[#4A7C6F] hover:bg-gray-50'}`}
        >
          On Sale
        </button>
        <button 
          onClick={() => setFilterTab('sold_out')} 
          className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${filterTab === 'sold_out' ? 'bg-[#E6FFF7] text-[#00C896]' : 'text-[#4A7C6F] hover:bg-gray-50'}`}
        >
          Sold Out
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C896]"></div>
        </div>
      ) : (
        <div className="px-5 py-5 space-y-5">
          {filteredProducts.map((item) => {
            const isLive = item.stock_percentage > 0;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 border-l-4 border-[#00C896] shadow-sm shadow-[#00C896]/5 flex flex-col">
                <div className="flex">
                  <div className="w-16 h-16 rounded-full border-2 border-[#00C896] overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 ml-3">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-base font-bold text-[#0D1F1A] truncate pr-2">{item.name}</h2>
                      <div className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isLive ? 'bg-[#E6FFF7] text-[#22C55E]' : 'bg-gray-100 text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${isLive ? 'bg-[#22C55E]' : 'bg-gray-400'}`} />
                        {isLive ? 'LIVE' : 'SOLD OUT'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center text-xs text-[#4A7C6F]">
                        <Clock size={12} className="mr-1" /> {item.term_days} Days
                      </div>
                      <div className="flex items-center text-xs text-[#4A7C6F]">
                        <Users size={12} className="mr-1" /> Limit: {item.quantity_limit}
                      </div>
                      <div className="flex items-center text-xs font-bold text-[#00C896]">
                        <TrendingUp size={12} className="mr-1" /> ₹{((item.investment_amount * item.daily_income_rate) / 100).toFixed(0)} ({item.daily_income_rate}%)
                      </div>
                      <div className="flex items-center text-xs text-[#4A7C6F]">
                        <Wallet size={12} className="mr-1" /> Total: ₹{item.total_income}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#F0FBF7]">
                  <div>
                    <span className="text-[10px] text-[#9ABFB5] block">Price</span>
                    <span className="text-base font-bold text-[#00C896]">₹{Number(item.investment_amount).toLocaleString()}</span>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="h-1.5 bg-[#F0FBF7] rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-[#00C896]" style={{ width: `${item.stock_percentage}%` }} />
                    </div>
                    <p className="text-[10px] text-[#4A7C6F] text-center">Stock {item.stock_percentage}%</p>
                  </div>

                  <Link
                    href={`/projects/${item.id}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform hover:-translate-y-0.5 shadow-sm inline-block ${
                      isLive 
                        ? 'bg-gradient-to-r from-[#00C896] to-[#009673] text-white shadow-[#00C896]/30' 
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-100 shadow-gray-400/30'
                    }`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-10 text-sm text-[#4A7C6F]">No products available in this category.</div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
