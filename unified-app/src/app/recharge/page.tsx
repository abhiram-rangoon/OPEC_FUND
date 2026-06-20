'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const QUICK_AMOUNTS = [200, 500, 1000, 5000, 10000, 50000];
const CHANNELS = [
  { id: 'Pay_A', label: 'Pay A 200-50k' },
  { id: 'Pay_B', label: 'Pay B 200-50k' },
  { id: 'Pay_C', label: 'Pay C 200-50k' },
  { id: 'Pay_D', label: 'Pay D 200-50k' },
];

export default function RechargeScreen() {
  const router = useRouter();
  const recharge = useAppStore((state) => state.recharge);
  
  const [amount, setAmount] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('Pay_A');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRecharge = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!amount || Number(amount) < 200) {
      setErrorMsg('Minimum recharge amount is ₹200');
      return;
    }

    setLoading(true);
    const success = await recharge(Number(amount), selectedChannel);
    setLoading(false);

    if (success) {
      setSuccessMsg(`Recharge of ₹${amount} completed successfully.`);
      setTimeout(() => router.back(), 2000);
    } else {
      setErrorMsg(useAppStore.getState().error || 'Failed to recharge');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold ml-2">Recharge</h1>
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        {/* Amount Card */}
        <div className="bg-white rounded-[20px] p-5 mb-5 shadow-sm shadow-[#00C896]/10">
          <h2 className="text-sm font-bold text-[#0D1F1A] mb-3">Recharge Amount</h2>
          
          <div className="flex bg-[#E6FFF7] rounded-xl h-14 items-center px-4 border-[1.5px] border-[#C6F6E5] mb-4 focus-within:border-[#00C896] transition-colors">
            <span className="text-2xl font-bold text-[#007A5E] mr-2">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-xl font-bold text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-wrap justify-between">
            {QUICK_AMOUNTS.map((amt) => {
              const isSelected = amount === amt.toString();
              return (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`w-[31%] rounded-full py-2.5 mb-2.5 border text-[13px] font-bold transition-all ${
                    isSelected 
                      ? 'bg-[#00C896] border-[#00C896] text-white shadow-md shadow-[#00C896]/20' 
                      : 'bg-white border-[#00C896] text-[#00C896] hover:bg-[#F0FBF7]'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Channels */}
        <div className="bg-white rounded-[20px] p-5 mb-5 shadow-sm shadow-[#00C896]/10">
          <h2 className="text-sm font-bold text-[#0D1F1A] mb-3">Select Payment Channel</h2>
          
          <div className="flex flex-wrap justify-between">
            {CHANNELS.map((ch) => {
              const isSelected = selectedChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`w-[48%] flex items-center justify-center rounded-full py-2.5 px-2 mb-2.5 border transition-all ${
                    isSelected 
                      ? 'bg-[#00C896] border-[#00C896] text-white shadow-sm' 
                      : 'bg-white border-[#00C896] text-[#00C896] hover:bg-[#F0FBF7]'
                  }`}
                >
                  {isSelected && <Check size={14} className="mr-1.5" />}
                  <span className="text-[11px] font-bold">{ch.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-2" />
            <span className="text-xs text-[#4A7C6F]">Minimum recharge amount is ₹200</span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-5 text-sm text-center font-medium border border-red-100">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-5 text-sm text-center font-medium border border-green-100">
            {successMsg}
          </div>
        )}

        {/* Confirm Button */}
        <button 
          onClick={handleRecharge} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00C896] to-[#009673] rounded-full h-14 flex justify-center items-center text-white text-base font-bold shadow-lg shadow-[#007A5E]/20 mb-6 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>

        {/* Kind Tips Card */}
        <div className="bg-[#F0FFF4] rounded-[20px] p-5 border border-[#C6F6D5]">
          <div className="flex items-center mb-2">
            <Lightbulb size={18} color="#007A5E" className="mr-1.5" />
            <span className="text-sm font-bold text-[#007A5E]">Important Tips</span>
          </div>
          <p className="text-xs text-[#4A7C6F] leading-[1.4] mb-4">
            The large number of daily deposit users may cause temporary congestion in the bank's system. If a deposit fails, you can try to re-initiate the deposit operation. If you still cannot succeed after multiple attempts, we suggest you check your account status or contact customer service for assistance.
          </p>

          <div className="border-l-[3px] border-[#00C896] pl-2 mb-2.5">
            <span className="text-[13px] font-bold text-[#0D1F1A]">Friendly Reminder</span>
          </div>
          <div className="flex items-start mb-2">
            <div className="w-[5px] h-[5px] rounded-full bg-[#00C896] mr-2 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#4A7C6F] leading-[1.4]">
              All OPEC Fund users must not save the recipient's UPI account information for duplicate payments when making deposits.
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-[5px] h-[5px] rounded-full bg-[#00C896] mr-2 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#4A7C6F] leading-[1.4]">
              Each time you deposit, you must first log in to the official OPEC Fund application and use the real-time account information displayed on the OPEC Fund app for each payment transaction. Do not save the recipient's bank account information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
