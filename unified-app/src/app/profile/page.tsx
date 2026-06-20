'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Landmark, Lock, FileText, Download, LogOut, ChevronRight, UserCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const totalAssets = Number(user?.balance || 0) + Number(user?.commission || 0);

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <UserCircle size={20} color="#00C896" />, href: '/profile/edit' },
    { id: 'bank', label: 'Withdrawal Account', icon: <Landmark size={20} color="#FFD700" />, href: '/profile/withdrawal-account' },
    { id: 'password', label: 'Password', icon: <Lock size={20} color="#00C896" />, href: '/profile/change-password' },
    { id: 'contract', label: 'Investment Contract', icon: <FileText size={20} color="#00C896" />, href: '/contract' },
    { id: 'download', label: 'Download App', icon: <Download size={20} color="#3B82F6" />, href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#F0FBF7] pb-24 relative overflow-y-auto no-scrollbar">
      {/* Profile Header */}
      <div className="bg-[#007A5E] flex flex-col items-center pt-12 pb-12 rounded-b-[32px] shadow-md">
        <div className="relative mb-4">
          <div className="w-[90px] h-[90px] rounded-full border-[3px] border-[#00C896] p-0.5 bg-white flex justify-center items-center shadow-lg">
            <div className="w-full h-full rounded-full bg-[#E6FFF7] flex justify-center items-center">
              <User size={44} color="#007A5E" strokeWidth={2} />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#FFD700] px-2 py-0.5 rounded-lg border-[1.5px] border-[#0D2018] shadow-md">
            <span className="text-[10px] font-bold text-[#0D2018]">VIP {user?.vip_level || 0}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">{user?.full_name || 'Member'}</h2>
        
        <div className="bg-[#E6FFF7] px-3 py-1 rounded-xl mb-2.5">
          <span className="text-xs font-bold text-[#007A5E]">{user?.rank || 'Rookie Captain'} 🏅</span>
        </div>

        <p className="text-xs text-[#E6FFF7] opacity-80">
          ID: {user?.id?.slice(0, 8).toUpperCase() || '******'}  |  Phone: +91 {user?.phone || '**********'}
        </p>
      </div>

      {/* Assets Card */}
      <div className="bg-white rounded-3xl mx-5 -mt-6 p-5 shadow-lg shadow-[#00C896]/10 border-t-4 border-[#00C896] relative z-10">
        <p className="text-xs text-[#9ABFB5] mb-1">Total Assets</p>
        <p className="text-[28px] font-bold text-[#00C896] mb-4">₹{totalAssets.toFixed(2)}</p>

        <div className="flex border-y border-[#F0FBF7] py-3 mb-4">
          <div className="flex-1 flex flex-col items-center border-r border-[#F0FBF7]">
            <span className="text-[11px] text-[#4A7C6F] mb-1">My Balance</span>
            <span className="text-sm font-bold text-[#0D1F1A]">₹{Number(user?.balance || 0).toFixed(2)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center border-r border-[#F0FBF7]">
            <span className="text-[11px] text-[#4A7C6F] mb-1">Commission</span>
            <span className="text-sm font-bold text-[#0D1F1A]">₹{Number(user?.commission || 0).toFixed(2)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[11px] text-[#4A7C6F] mb-1">Today's Income</span>
            <span className="text-sm font-bold text-[#3B82F6]">₹0.00</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link href="/recharge" className="flex-1 h-12 bg-gradient-to-r from-[#00C896] to-[#009673] rounded-full text-white font-bold text-[15px] flex justify-center items-center shadow-md shadow-[#00C896]/20 transition-transform hover:-translate-y-0.5">
            Recharge
          </Link>
          <Link href="/withdraw" className="flex-1 h-12 border-2 border-[#00C896] rounded-full text-[#00C896] font-bold text-[15px] flex justify-center items-center transition-transform hover:-translate-y-0.5 hover:bg-[#F0FBF7]">
            Withdraw
          </Link>
        </div>
      </div>

      {/* Settings Menu List */}
      <div className="mx-5 mt-5 space-y-3">
        {menuItems.map((item) => (
          <Link 
            key={item.id} 
            href={item.href}
            className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm shadow-[#00C896]/5 hover:bg-[#F0FBF7] transition-colors"
          >
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-[#E6FFF7] flex justify-center items-center mr-3">
                {item.icon}
              </div>
              <span className="text-[15px] font-bold text-[#0D1F1A]">{item.label}</span>
            </div>
            <ChevronRight size={18} color="#9ABFB5" />
          </Link>
        ))}

        <button 
          onClick={handleLogout} 
          className="w-full flex items-center bg-white rounded-2xl p-4 shadow-sm shadow-[#00C896]/5 mt-3 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex justify-center items-center mr-3">
              <LogOut size={20} color="#EF4444" />
            </div>
            <span className="text-[15px] font-bold text-red-500">Logout</span>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
