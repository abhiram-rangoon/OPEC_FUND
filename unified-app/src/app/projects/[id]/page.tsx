'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Clock, Users, TrendingUp, Wallet, ShieldCheck, FileText, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const products = useAppStore((state) => state.products);
  const user = useAppStore((state) => state.user);
  const investAction = useAppStore((state) => state.invest);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const fetchProfile = useAppStore((state) => state.fetchProfile);

  const [product, setProduct] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // If products aren't loaded, load them
    if (products.length === 0) {
      fetchProducts();
    }
    fetchProfile();
  }, [fetchProducts, fetchProfile, products.length]);

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setInvestAmount(found.investment_amount.toString());
    }
  }, [id, products]);

  const handleConfirmInvest = async () => {
    setLocalError('');
    setSuccessMsg('');
    if (!product) return;
    const amount = Number(investAmount);
    if (!amount || amount <= 0) {
      setLocalError('Please enter a valid amount to invest.');
      return;
    }

    setInvesting(true);
    const success = await investAction(product.id, amount);
    setInvesting(false);
    
    if (success) {
      setSuccessMsg(`You successfully invested ₹${amount} in ${product.name}.`);
      setTimeout(() => {
        router.push('/projects');
      }, 2000);
    } else {
      const errorMsg = useAppStore.getState().error;
      setLocalError(errorMsg || 'Transaction declined.');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F0FBF7] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  const isLive = product.stock_percentage > 0;
  const dailyYield = ((product.investment_amount * product.daily_income_rate) / 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative pb-28">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full z-20 max-w-md">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold ml-2">Project Details</h1>
      </div>

      <div className="pt-[116px] px-4 overflow-y-auto">
        
        {/* Product Image and Title */}
        <div className="bg-white rounded-[20px] overflow-hidden mb-5 shadow-sm shadow-[#00C896]/10">
          <div className="h-48 w-full bg-gray-200 relative">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-md ${isLive ? 'bg-[#00C896] text-white' : 'bg-gray-400 text-white'}`}>
              {isLive ? 'LIVE' : 'SOLD OUT'}
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-[20px] font-bold text-[#0D1F1A] mb-2 leading-tight">{product.name}</h2>
            <div className="flex items-center text-sm text-[#4A7C6F] mb-4">
              <ShieldCheck size={16} className="text-[#00C896] mr-1.5" /> 
              Capital & Return Guaranteed
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F0FBF7]">
              <div>
                <span className="block text-[11px] text-[#9ABFB5] uppercase mb-1">Project Term</span>
                <div className="flex items-center font-bold text-[#0D1F1A]">
                  <Clock size={16} className="text-[#00C896] mr-2" /> {product.term_days} Days
                </div>
              </div>
              <div>
                <span className="block text-[11px] text-[#9ABFB5] uppercase mb-1">Daily Yield</span>
                <div className="flex items-center font-bold text-[#0D1F1A]">
                  <TrendingUp size={16} className="text-[#00C896] mr-2" /> {product.daily_income_rate}%
                </div>
              </div>
              <div>
                <span className="block text-[11px] text-[#9ABFB5] uppercase mb-1">Purchase Limit</span>
                <div className="flex items-center font-bold text-[#0D1F1A]">
                  <Users size={16} className="text-[#00C896] mr-2" /> {product.quantity_limit} per user
                </div>
              </div>
              <div>
                <span className="block text-[11px] text-[#9ABFB5] uppercase mb-1">Total Return</span>
                <div className="flex items-center font-bold text-[#0D1F1A]">
                  <Wallet size={16} className="text-[#00C896] mr-2" /> ₹{product.total_income}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-[20px] p-5 mb-5 shadow-sm shadow-[#00C896]/10">
          <div className="flex items-center mb-3">
            <FileText size={18} className="text-[#00C896] mr-2" />
            <h3 className="text-[15px] font-bold text-[#0D1F1A]">Investment Rules & Details</h3>
          </div>
          <ul className="space-y-3 text-[13px] text-[#4A7C6F] leading-relaxed">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mt-1.5 mr-2.5 flex-shrink-0" />
              <span>The daily income is <strong className="text-[#0D1F1A]">₹{dailyYield}</strong>, which will be credited directly to your wallet every 24 hours.</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mt-1.5 mr-2.5 flex-shrink-0" />
              <span>Your initial principal amount will be returned to your account balance at the end of the <strong className="text-[#0D1F1A]">{product.term_days}-day</strong> term.</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mt-1.5 mr-2.5 flex-shrink-0" />
              <span>Dividends can be withdrawn instantly subject to minimum withdrawal policies.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Fixed Bottom Investment Panel */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-[#E6FFF7] p-5 pb-8 z-30 shadow-[0_-4px_20px_rgba(0,200,150,0.05)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="block text-[11px] text-[#9ABFB5]">Investment Amount</span>
            <span className="text-xl font-bold text-[#00C896]">₹{Number(product.investment_amount).toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-[#9ABFB5]">Wallet Balance</span>
            <span className="text-sm font-bold text-[#0D1F1A]">₹{Number(user?.balance || 0).toLocaleString()}</span>
          </div>
        </div>

        {(localError || successMsg) && (
          <div className={`p-3 rounded-lg mb-4 text-sm text-center font-bold ${successMsg ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {successMsg || localError}
          </div>
        )}

        <button
          onClick={handleConfirmInvest}
          disabled={!isLive || investing}
          className={`w-full h-[52px] rounded-full text-white font-bold text-[15px] flex justify-center items-center transition-all ${
            isLive 
              ? 'bg-gradient-to-r from-[#00C896] to-[#009673] shadow-lg shadow-[#00C896]/30 hover:shadow-[#00C896]/50 hover:-translate-y-0.5' 
              : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-100 shadow-gray-400/30'
          } disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed`}
        >
          {investing ? 'Processing...' : isLive ? 'Invest Now' : 'Sold Out'}
        </button>
      </div>

    </div>
  );
}
