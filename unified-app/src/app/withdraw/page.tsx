'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Landmark, Edit3, Coins, Percent, AlertCircle, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function WithdrawScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const withdraw = useAppStore((state) => state.withdraw);

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const receivedAmount = amount ? Number(amount) * 0.98 : 0; // 2% fee

  const handleWithdraw = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const amt = Number(amount);
    
    if (!amt || amt < 180) {
      setErrorMsg('Minimum withdrawal is ₹180');
      return;
    }
    if (amt > Number(user?.balance || 0)) {
      setErrorMsg('Insufficient balance');
      return;
    }

    setLoading(true);
    const success = await withdraw(amt);
    setLoading(false);

    if (success) {
      setSuccessMsg(`Withdrawal of ₹${amount} submitted successfully.`);
      setTimeout(() => router.back(), 2000);
    } else {
      setErrorMsg(useAppStore.getState().error || 'Withdrawal failed');
    }
  };

  const isBankBound = !!user?.withdrawal_account;

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold ml-2">Withdraw</h1>
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        
        {/* Withdrawal Account Card */}
        {!isBankBound ? (
          <button 
            onClick={() => router.push('/profile/withdrawal-account')}
            className="w-full bg-white rounded-[20px] p-6 flex flex-col items-center border-2 border-[#00C896] border-dashed mb-5 shadow-sm shadow-[#00C896]/5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#E6FFF7] flex justify-center items-center mb-2.5">
              <Plus size={24} color="#00C896" />
            </div>
            <span className="text-[15px] font-bold text-[#007A5E] mb-1">Add Withdrawal Account</span>
            <span className="text-xs text-[#9ABFB5]">Add your bank/UPI to withdraw funds</span>
          </button>
        ) : (
          <div className="bg-white rounded-[20px] p-5 flex justify-between items-center mb-5 shadow-sm shadow-[#00C896]/10">
            <div className="flex items-center">
              <Landmark size={22} color="#00C896" />
              <div className="ml-3">
                <span className="block text-[15px] font-bold text-[#0D1F1A]">{user?.withdrawal_bank || 'Bank Account'}</span>
                <span className="block text-xs text-[#9ABFB5] mt-0.5">Acc: *******{user?.withdrawal_account?.slice(-4)}</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/profile/withdrawal-account')}
              className="w-9 h-9 rounded-full bg-[#E6FFF7] flex justify-center items-center hover:bg-[#C6F6E5] transition-colors"
            >
              <Edit3 size={18} color="#00C896" />
            </button>
          </div>
        )}

        {/* Amount Input Card */}
        <div className="bg-white rounded-[20px] p-5 mb-5 shadow-sm shadow-[#00C896]/10">
          <div className="flex justify-between items-center border-b border-[#F0FBF7] pb-3 mb-4">
            <span className="text-[13px] text-[#9ABFB5]">Total Assets</span>
            <span className="text-xl font-bold text-[#00C896]">₹{Number(user?.balance || 0).toFixed(2)}</span>
          </div>

          <label className="block text-sm font-bold text-[#0D1F1A] mb-2.5">Withdrawal Amount</label>
          <div className="flex bg-[#E6FFF7] rounded-xl h-14 items-center px-4 border-[1.5px] border-[#C6F6E5] focus-within:border-[#00C896] transition-colors">
            <span className="text-xl font-bold text-[#007A5E] mr-2">₹</span>
            <input
              type="number"
              placeholder="Please enter the withdrawal amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-base font-bold text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
          </div>
        </div>

        {/* Horizontal Scrollable Info Pills */}
        <div className="overflow-x-auto no-scrollbar mb-6">
          <div className="flex w-max pr-4">
            <div className="flex items-center bg-[#E6FFF7] rounded-full px-3.5 py-2 mr-2.5 border border-[#C6F6E5]">
              <Coins size={14} color="#007A5E" className="mr-1.5" />
              <span className="text-xs font-bold text-[#007A5E]">Received: ₹{receivedAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center bg-[#E6FFF7] rounded-full px-3.5 py-2 mr-2.5 border border-[#C6F6E5]">
              <Percent size={14} color="#007A5E" className="mr-1.5" />
              <span className="text-xs font-bold text-[#007A5E]">Fee: 2%</span>
            </div>
            <div className="flex items-center bg-[#E6FFF7] rounded-full px-3.5 py-2 mr-2.5 border border-[#C6F6E5]">
              <AlertCircle size={14} color="#007A5E" className="mr-1.5" />
              <span className="text-xs font-bold text-[#007A5E]">Min: ₹180</span>
            </div>
            <div className="flex items-center bg-[#E6FFF7] rounded-full px-3.5 py-2 border border-[#C6F6E5]">
              <Clock size={14} color="#007A5E" className="mr-1.5" />
              <span className="text-xs font-bold text-[#007A5E]">Mon–Thu, 10 AM – 4 PM</span>
            </div>
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
          onClick={handleWithdraw} 
          disabled={loading || !isBankBound} 
          className="w-full bg-gradient-to-r from-[#00C896] to-[#009673] rounded-full h-[52px] flex justify-center items-center text-white text-base font-bold shadow-lg shadow-[#007A5E]/20 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
