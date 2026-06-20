'use client';
import React, { useEffect, useState } from 'react';
import { Crown, Share2, Clipboard, ShieldCheck, Users, Award } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import api from '@/services/api';
import BottomNav from '@/components/BottomNav';

export default function VIPScreen() {
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const [team, setTeam] = useState<any>({ levelA: [], levelB: [], levelC: [] });
  const [loading, setLoading] = useState(false);
  const [activeTeamTab, setActiveTeamTab] = useState<'A' | 'B' | 'C'>('A');
  const [copyMsg, setCopyMsg] = useState('');

  useEffect(() => {
    const loadTeamData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/vip/my-team');
        setTeam(res.data.team);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadTeamData();
    fetchProfile();
  }, [fetchProfile]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://oilfund.net/auth/reg?ref=${user?.referral_code || 'REF'}`);
    setCopyMsg('Link Copied!');
    setTimeout(() => setCopyMsg(''), 2000);
  };

  const getTeamList = () => {
    if (activeTeamTab === 'A') return team.levelA;
    if (activeTeamTab === 'B') return team.levelB;
    return team.levelC;
  };

  const ranks = [
    { name: 'Rookie Captain', threshold: '₹0', commission: '0%' },
    { name: 'Bronze Captain', threshold: '₹50,000', commission: '5%' },
    { name: 'Silver Captain', threshold: '₹100,000', commission: '10%' },
    { name: 'Gold Captain', threshold: '₹150,000', commission: '15%' },
    { name: 'Platinum Partner', threshold: '₹200,000', commission: '20%' },
    { name: 'Diamond Partner', threshold: '₹250,000', commission: '25%' }
  ];

  return (
    <div className="min-h-screen bg-[#F0FBF7] pb-24 relative overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="bg-[#007A5E] pt-12 pb-5 flex justify-center shadow-md">
        <h1 className="text-xl font-bold text-white">VIP Club & Referrals</h1>
      </div>

      {copyMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#00C896] text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold animate-pulse">
          {copyMsg}
        </div>
      )}

      {/* VIP Status Card */}
      <div className="bg-[#0D2018] rounded-3xl mx-5 my-5 p-6 shadow-lg shadow-[#FFD700]/10 border border-[#FFD700]/30">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Crown size={22} color="#FFD700" />
            <span className="text-base font-bold text-[#FFD700] ml-2">VIP 10 STATUS</span>
          </div>
          <div className="flex items-center bg-[#FFD700]/10 px-2 py-1 rounded-lg">
            <ShieldCheck size={14} color="#FFD700" />
            <span className="text-[11px] font-bold text-[#FFD700] ml-1">Active Partner</span>
          </div>
        </div>

        <p className="text-sm text-[#E6FFF7] mb-4">Refer 40 more A-level investors to level up</p>
        
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#FFD700] w-[45%]" />
        </div>
        <p className="text-[11px] text-[#9ABFB5]">Current Progress: 18 / 40 Investors</p>
      </div>

      {/* Refer Friends Section */}
      <div className="bg-white rounded-2xl mx-5 mb-6 overflow-hidden shadow-sm shadow-[#00C896]/5">
        <div className="bg-[#007A5E] py-2.5 text-center">
          <span className="text-[13px] font-bold text-white">Refer Friends & Earn Passive Rewards</span>
        </div>

        <div className="flex flex-col items-center p-5">
          <div className="w-[120px] h-[120px] border border-[#9ABFB5] rounded-xl flex justify-center items-center mb-4 p-1.5">
            <div className="w-full h-full rounded-lg bg-[#F0FBF7] border-[1.5px] border-dashed border-[#00C896] flex justify-center items-center">
              <span className="text-[10px] font-bold text-[#007A5E]">[ QR CODE ]</span>
            </div>
          </div>

          <p className="text-xs text-[#4A7C6F] mb-1">Your Referral Code</p>
          <p className="text-[22px] font-bold text-[#00C896] mb-4">{user?.referral_code || 'REF-CODE'}</p>

          <div className="flex w-full mb-3">
            <input
              type="text"
              readOnly
              value={`https://oilfund.net/auth/reg?ref=${user?.referral_code || 'REF'}`}
              className="flex-1 bg-[#F0FBF7] rounded-lg px-3 text-xs text-[#4A7C6F] h-10 border border-[#E6FFF7] outline-none"
            />
            <button onClick={handleCopyLink} className="w-10 h-10 rounded-lg bg-[#00C896] flex justify-center items-center ml-2 hover:bg-[#009673] transition-colors">
              <Clipboard size={18} color="#FFFFFF" />
            </button>
          </div>

          <button onClick={handleCopyLink} className="flex justify-center items-center bg-[#FFD700] rounded-lg py-2.5 w-full hover:bg-[#E6C200] transition-colors">
            <Share2 size={18} color="#0D1F1A" className="mr-2" />
            <span className="text-sm font-bold text-[#0D1F1A]">Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* VIP Commission Rules */}
      <div className="px-5 mb-3">
        <h2 className="text-base font-bold text-[#0D1F1A]">Commission Structure</h2>
      </div>

      <div className="px-5 mb-6 space-y-3">
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#00C896] shadow-sm shadow-[#00C896]/5 flex flex-col items-start">
          <span className="text-[10px] font-bold bg-[#E6FFF7] text-[#00C896] px-2 py-0.5 rounded mb-1.5">Tier A</span>
          <p className="text-[15px] font-bold text-[#0D1F1A] mb-1">7% Commission</p>
          <p className="text-xs text-[#4A7C6F]">Earned from your direct first-level referrals.</p>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#007A5E] shadow-sm shadow-[#00C896]/5 flex flex-col items-start">
          <span className="text-[10px] font-bold bg-[#E6FFF7] text-[#007A5E] px-2 py-0.5 rounded mb-1.5">Tier B</span>
          <p className="text-[15px] font-bold text-[#0D1F1A] mb-1">5% Commission</p>
          <p className="text-xs text-[#4A7C6F]">Earned from second-level sub-referrals.</p>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#9ABFB5] shadow-sm shadow-[#00C896]/5 flex flex-col items-start">
          <span className="text-[10px] font-bold bg-gray-100 text-[#9ABFB5] px-2 py-0.5 rounded mb-1.5">Tier C</span>
          <p className="text-[15px] font-bold text-[#0D1F1A] mb-1">3% Commission</p>
          <p className="text-xs text-[#4A7C6F]">Earned from third-level sub-referrals.</p>
        </div>
      </div>

      {/* Position Rank Grid */}
      <div className="px-5 mb-3">
        <h2 className="text-base font-bold text-[#0D1F1A]">Position Ranks</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 mb-6">
        {ranks.map((r, i) => {
          const isCurrent = user?.rank === r.name;
          return (
            <div key={i} className={`bg-white rounded-xl p-3 border-2 shadow-sm ${isCurrent ? 'border-[#00C896] bg-[#F0FBF7]' : 'border-transparent'}`}>
              <Award size={20} color={isCurrent ? '#FFD700' : '#4A7C6F'} className="mb-2" />
              <p className={`text-[13px] font-bold mb-1.5 ${isCurrent ? 'text-[#00C896]' : 'text-[#0D1F1A]'}`}>{r.name}</p>
              <p className="text-[11px] text-[#4A7C6F] mb-0.5">Min Invest: {r.threshold}</p>
              <p className="text-[11px] font-bold text-[#007A5E]">Commission: {r.commission}</p>
            </div>
          );
        })}
      </div>

      {/* My Team Section */}
      <div className="px-5 mb-3">
        <h2 className="text-base font-bold text-[#0D1F1A]">My Team Analytics</h2>
      </div>

      <div className="bg-white rounded-2xl mx-5 p-4 shadow-sm shadow-[#00C896]/5">
        <div className="flex justify-between items-center border-b border-[#F0FBF7] pb-3">
          <div>
            <p className="text-xs text-[#4A7C6F] mb-1">Commissions Earned</p>
            <p className="text-[22px] font-bold text-[#FFD700]">₹{Number(user?.commission || 0).toFixed(2)}</p>
          </div>
          <Users size={32} color="#FFD700" />
        </div>

        <div className="flex justify-between py-4 border-b border-[#F0FBF7]">
          <div className="flex flex-col items-center flex-1">
            <span className="text-base font-bold text-[#0D1F1A] mb-1">{team.levelA.length + team.levelB.length + team.levelC.length}</span>
            <span className="text-[11px] text-[#4A7C6F]">Registrants</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-base font-bold text-[#0D1F1A] mb-1">{team.levelA.length}</span>
            <span className="text-[11px] text-[#4A7C6F]">Investors</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-base font-bold text-[#0D1F1A] mb-1">{team.levelA.filter((t: any) => t.investment_earned > 0).length}</span>
            <span className="text-[11px] text-[#4A7C6F]">A-level</span>
          </div>
        </div>

        <div className="flex py-3">
          {(['A', 'B', 'C'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTeamTab(tab)}
              className={`flex-1 pb-2 text-xs font-bold border-b-2 transition-colors ${activeTeamTab === tab ? 'border-[#00C896] text-[#00C896]' : 'border-transparent text-[#4A7C6F]'}`}
            >
              Level {tab}
            </button>
          ))}
        </div>

        <div className="flex bg-[#F0FBF7] py-2 px-2 rounded-md mb-2">
          <span className="flex-[1.5] text-[11px] font-bold text-[#4A7C6F] text-center">Mobile Number</span>
          <span className="flex-1 text-[11px] font-bold text-[#4A7C6F] text-center">Level</span>
          <span className="flex-1 text-[11px] font-bold text-[#4A7C6F] text-center">Commission</span>
        </div>

        {loading ? (
           <div className="py-5 flex justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00C896]"></div></div>
        ) : getTeamList().length === 0 ? (
          <div className="py-5 flex justify-center">
            <span className="text-xs text-[#9ABFB5]">No members registered in Level {activeTeamTab} yet.</span>
          </div>
        ) : (
          getTeamList().map((item: any) => (
            <div key={item.id} className="flex py-2.5 px-2 border-b border-[#F0FBF7]">
              <span className="flex-[1.5] text-xs text-[#0D1F1A] text-center">{item.mobile || '77****1234'}</span>
              <span className="flex-1 text-xs text-[#0D1F1A] text-center">Lvl {item.level}</span>
              <span className="flex-1 text-xs font-bold text-[#00C896] text-center">₹{Number(item.commission_earned || 0).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
