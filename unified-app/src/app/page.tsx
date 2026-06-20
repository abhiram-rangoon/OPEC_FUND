'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, CreditCard, Landmark, Gift, Clipboard, ArrowRight, ChevronRight, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';

const BANNERS = [
  { id: '1', title: 'Offshore Wind Farm Grid', amount: '$45M', location: 'North Sea', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80' },
  { id: '2', title: 'Solar Reserve Phase IV', amount: '$28M', location: 'Rajasthan', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80' },
  { id: '3', title: 'Geothermal Thermal Basin', amount: '$12M', location: 'Iceland', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80' }
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const investments = useAppStore((state) => state.investments);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const fetchInvestments = useAppStore((state) => state.fetchInvestments);

  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchInvestments();
  }, [fetchProfile, fetchInvestments]);

  // Auto scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalAssets = Number(user?.balance || 0) + Number(user?.commission || 0);
  const investmentAmount = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const earned = investments.reduce((acc, inv) => acc + Number(inv.total_income), 0);
  const dailyIncome = investments.reduce((acc, inv) => acc + Number(inv.daily_income), 0);
  const estimatedTotal = investmentAmount + earned;

  const filteredInvestments = investments.filter((inv) => inv.status === activeTab);
  const currentBanner = BANNERS[currentBannerIndex];

  return (
    <div className="min-h-screen bg-[#F0FBF7] pb-24 relative overflow-y-auto overflow-x-hidden no-scrollbar">
      {/* Header Background */}
      <div className="bg-[#007A5E] rounded-b-[32px] px-5 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 mr-3 overflow-hidden">
            <h1 className="text-xl font-bold text-white truncate">
              Good Morning, {user?.full_name || 'Member'} 👋
            </h1>
            <p className="text-xs text-[#E6FFF7] mt-1 opacity-80 truncate">
              ID: {user?.id ? user.id.slice(0, 8).toUpperCase() : '******'} | +91 {user?.phone || '**********'}
            </p>
          </div>
          <div className="flex space-x-2 border-none">
            <button onClick={() => router.push('/notifications')} className="w-10 h-10 rounded-full bg-white/15 flex justify-center items-center">
              <Bell color="#FFFFFF" size={20} />
            </button>
            <button onClick={() => router.push('/chat')} className="w-10 h-10 rounded-full bg-white/15 flex justify-center items-center">
              <MessageSquare color="#FFFFFF" size={20} />
            </button>
          </div>
        </div>

        {/* Assets Glass Card */}
        <div className="relative overflow-hidden rounded-3xl p-5 border border-white/20 bg-white/10 backdrop-blur-md shadow-lg shadow-black/5">
          <div className="absolute -bottom-5 right-0 opacity-10 text-[80px] font-bold select-none text-white leading-none">📈</div>
          <p className="text-sm text-[#E6FFF7] opacity-90">Total Assets</p>
          <p className="text-3xl font-bold text-white my-2">₹{totalAssets.toFixed(2)}</p>
          <p className="text-sm text-[#E6FFF7] opacity-80">Wallet Balance: ₹{Number(user?.balance || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Auto scrolling Banner */}
      <div className="mt-6 px-5 relative">
        <div className="w-full h-[180px] rounded-2xl overflow-hidden relative shadow-lg">
          <img src={currentBanner.image} alt={currentBanner.title} className="w-full h-full object-cover transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#004D3D]/90 to-transparent p-4 flex flex-col justify-end">
            <span className="text-[10px] font-bold text-[#FFD700] mb-1">LIVE INVESTMENT</span>
            <h3 className="text-lg font-bold text-white mb-1">{currentBanner.title}</h3>
            <div className="flex items-center text-xs text-[#E6FFF7]">
              <span>Target: {currentBanner.amount}</span>
              <span className="mx-2">•</span>
              <span>{currentBanner.location}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-3 space-x-2">
          {BANNERS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentBannerIndex === i ? 'w-5 bg-[#00C896]' : 'w-1.5 bg-[#9ABFB5]'}`} />
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-3 px-5 mt-6">
        <Link href="/recharge" className="bg-[#E6FFF7] rounded-2xl p-4 flex flex-col items-center shadow-sm shadow-[#00C896]/10 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-[#00C896] flex justify-center items-center mb-2">
            <CreditCard color="#FFFFFF" size={24} />
          </div>
          <span className="text-xs font-bold text-[#0D1F1A]">Recharge</span>
        </Link>
        <Link href="/withdraw" className="bg-[#FFFDF0] rounded-2xl p-4 flex flex-col items-center shadow-sm shadow-[#00C896]/10 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD700] flex justify-center items-center mb-2">
            <Landmark color="#0D1F1A" size={24} />
          </div>
          <span className="text-xs font-bold text-[#0D1F1A]">Withdraw</span>
        </Link>
        <Link href="/bonus" className="bg-[#F0FFFA] rounded-2xl p-4 flex flex-col items-center shadow-sm shadow-[#00C896]/10 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-[#00E5B0] flex justify-center items-center mb-2">
            <Gift color="#FFFFFF" size={24} />
          </div>
          <span className="text-xs font-bold text-[#0D1F1A]">Cash Bonus</span>
        </Link>
        <Link href="/notice" className="bg-[#F0F5FF] rounded-2xl p-4 flex flex-col items-center shadow-sm shadow-[#00C896]/10 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-[#3B82F6] flex justify-center items-center mb-2">
            <Clipboard color="#FFFFFF" size={24} />
          </div>
          <span className="text-xs font-bold text-[#0D1F1A]">Notice</span>
        </Link>
      </div>

      {/* About Section */}
      <div 
        onClick={() => setAboutOpen(!aboutOpen)} 
        className="bg-white rounded-2xl mx-5 mt-6 p-4 border-l-4 border-[#00C896] shadow-sm cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-[#0D1F1A]">About OPEC OilFund</h2>
          <ChevronRight size={20} color="#4A7C6F" className={`transition-transform duration-300 ${aboutOpen ? 'rotate-90' : ''}`} />
        </div>
        {aboutOpen && (
          <p className="mt-3 text-sm text-[#4A7C6F] leading-relaxed">
            The OPEC Fund for International Development is a multilateral development finance institution established in 1976. Our clean energy and sovereign reserves investment pool offers high-yield assets to help build and finance sustainable development projects globally.
          </p>
        )}
      </div>

      {/* My Investments Metrics */}
      <div className="flex justify-between items-center px-5 mt-6 mb-4">
        <h2 className="text-lg font-bold text-[#0D1F1A]">My Investments</h2>
        <Link href="/projects" className="flex items-center text-sm font-bold text-[#00C896]">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-[#00C896]/5">
          <p className="text-lg font-bold text-[#00C896] mb-1">₹{investmentAmount.toFixed(2)}</p>
          <p className="text-xs text-[#4A7C6F]">Investment Amount</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-[#00C896]/5">
          <p className="text-lg font-bold text-[#FFD700] mb-1">₹{earned.toFixed(2)}</p>
          <p className="text-xs text-[#4A7C6F]">Earned</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-[#00C896]/5">
          <p className="text-lg font-bold text-[#3B82F6] mb-1">₹{dailyIncome.toFixed(2)}</p>
          <p className="text-xs text-[#4A7C6F]">Daily Income</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-[#00C896]/5">
          <p className="text-lg font-bold text-[#8B5CF6] mb-1">₹{estimatedTotal.toFixed(2)}</p>
          <p className="text-xs text-[#4A7C6F]">Estimated Total</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#E6FFF7] rounded-full p-1 mx-5 mb-4">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'active' ? 'bg-[#00C896] text-white' : 'text-[#4A7C6F]'}`}
        >
          Active
        </button>
        <button 
          onClick={() => setActiveTab('expired')} 
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'expired' ? 'bg-[#00C896] text-white' : 'text-[#4A7C6F]'}`}
        >
          Expired
        </button>
      </div>

      {/* Investment List */}
      <div className="px-5 space-y-3">
        {filteredInvestments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <HelpCircle size={48} color="#9ABFB5" className="mb-3" />
            <p className="text-sm text-[#4A7C6F]">No investment records found in this category.</p>
          </div>
        ) : (
          filteredInvestments.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm shadow-[#00C896]/5 border border-gray-50">
              <div>
                <p className="text-[15px] font-bold text-[#0D1F1A] mb-1">{inv.product?.name || 'Investment Pool'}</p>
                <p className="text-xs text-[#4A7C6F]">Term: {inv.product?.term_days || 7} Days</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-base font-bold text-[#00C896] mb-1">₹{Number(inv.amount).toFixed(2)}</p>
                <span className="text-[10px] font-bold text-[#22C55E] bg-[#E6FFF7] px-2 py-0.5 rounded">
                  {inv.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Nav Spacer & Component */}
      <BottomNav />
    </div>
  );
}
