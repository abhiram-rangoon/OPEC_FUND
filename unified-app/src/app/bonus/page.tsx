'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Gift, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import api from '@/services/api';

export default function BonusScreen() {
  const router = useRouter();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [bonusHistory, setBonusHistory] = useState<any[]>([]);

  useEffect(() => {
    loadBonusHistory();
  }, []);

  const loadBonusHistory = async () => {
    try {
      const res = await api.get('/vip/bonus-history');
      setBonusHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRedeem = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!code.trim()) {
      setErrorMsg('Please enter a bonus code');
      return;
    }

    setLoading(true);
    // Simulate API call for redeeming bonus
    setTimeout(async () => {
      setLoading(false);
      if (code.trim().toUpperCase() === 'WELCOME100') {
        try {
          await api.post('/vip/redeem-bonus', { code });
          setSuccessMsg('Bonus successfully redeemed!');
          setCode('');
          loadBonusHistory();
        } catch (err) {
          setErrorMsg('Network error occurred.');
        }
      } else {
        setErrorMsg('This bonus code has expired or is invalid.');
      }
    }, 1200);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const totalRedeemed = bonusHistory.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold ml-2">Cash Bonus</h1>
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        
        {/* Redeemed Bonus Hero */}
        <div className="flex justify-between items-center bg-[#00C896] rounded-[20px] p-6 mb-5 shadow-lg shadow-[#00C896]/20">
          <div>
            <p className="text-xs text-[#E6FFF7] opacity-90 mb-1.5">Total Redeemed</p>
            <p className="text-[32px] font-bold text-white">₹{totalRedeemed.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex justify-center items-center">
            <Gift size={32} color="#FFFFFF" />
          </div>
        </div>

        {/* Redeem Form Card */}
        <div className="bg-white rounded-[20px] p-5 mb-5 shadow-sm shadow-[#00C896]/10">
          <label className="block text-sm font-bold text-[#0D1F1A] mb-3">Enter Bonus Code</label>
          <div className="flex bg-[#E6FFF7] rounded-xl h-[52px] items-center px-4 border-[1.5px] border-[#C6F6E5] mb-4 focus-within:border-[#00C896] transition-colors">
            <input
              type="text"
              placeholder="Enter your cash bonus code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent text-[15px] font-bold text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5] uppercase"
            />
            <button onClick={handlePaste} className="pl-3 text-sm font-bold text-[#00C896] hover:text-[#007A5E] transition-colors">
              Paste
            </button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center font-medium border border-red-100">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm text-center font-medium border border-green-100">
              {successMsg}
            </div>
          )}

          <button 
            onClick={handleRedeem} 
            disabled={loading}
            className="w-full bg-[#00C896] rounded-full h-12 flex justify-center items-center text-white text-[15px] font-bold shadow-md shadow-[#007A5E]/10 hover:bg-[#009673] transition-colors disabled:opacity-60"
          >
            {loading ? 'Redeeming...' : 'Redeem Now'}
          </button>
        </div>

        {/* Redemption History Card */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm shadow-[#00C896]/10">
          <div className="flex items-center border-b border-[#F0FBF7] pb-3 mb-4">
            <Clock size={18} color="#007A5E" className="mr-2" />
            <h2 className="text-[15px] font-bold text-[#0D1F1A]">Redemption History</h2>
          </div>

          {bonusHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Gift size={40} color="#9ABFB5" className="mb-2.5" />
              <p className="text-sm font-bold text-[#4A7C6F] mb-1">No bonus codes redeemed yet</p>
              <p className="text-xs text-[#9ABFB5]">Valid promotional codes will display here.</p>
            </div>
          ) : (
            bonusHistory.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-[#F0FBF7] last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#0D1F1A] mb-1">{item.note || 'OPEC-PROMO'}</p>
                  <p className="text-[11px] text-[#9ABFB5]">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[15px] font-bold text-[#00C896] mb-1">+₹{Number(item.amount).toFixed(2)}</p>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'approved' ? 'bg-[#E6FFF7] text-[#00C896]' : 'bg-[#FFFDF0] text-[#D97706]'}`}>
                    {item.status === 'approved' ? 'Success' : 'Pending'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
