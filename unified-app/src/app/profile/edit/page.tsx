'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Crown, MessageSquare, Globe as Facebook, Send } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import api from '@/services/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  
  const [nickname, setNickname] = useState(user?.full_name || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user?.full_name) {
      setNickname(user.full_name);
    }
  }, [user]);

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!nickname.trim()) {
      setErrorMsg('Please enter a valid nickname.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/profile/update', { full_name: nickname });
      if (response.data?.profile) {
        await fetchProfile();
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => router.back(), 2000);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">My Profile</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center bg-[#007A5E] rounded-3xl py-6 mb-5 shadow-lg shadow-[#007A5E]/10">
          <div className="w-20 h-20 rounded-full border-2 border-[#00C896] relative mb-2.5">
            <div className="w-full h-full rounded-full bg-[#E6FFF7] flex justify-center items-center">
              <User size={40} color="#007A5E" strokeWidth={2} />
            </div>
            {/* VIP Crown */}
            <div className="absolute -top-3.5 left-7 w-6 h-6 flex justify-center items-center">
              <Crown size={16} color="#FFD700" fill="#FFD700" />
            </div>
          </div>
          <span className="text-xs text-white opacity-90 mt-0.5">ID: {user?.id?.slice(0, 8).toUpperCase() || '******'}</span>
          <span className="text-xs text-white opacity-90 mt-0.5">Phone: +91 {user?.phone || '**********'}</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm shadow-[#00C896]/10">
          <label className="block text-[13px] font-bold text-[#4A7C6F] mb-2">Nick Name</label>
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-4 border border-[#C6F6E5] mb-5 focus-within:border-[#00C896] transition-colors">
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 bg-transparent text-sm font-bold text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
          </div>

          {/* Contact info heading */}
          <div className="border-l-[3px] border-[#00C896] pl-2 mb-4">
            <h3 className="text-sm font-bold text-[#0D1F1A]">Contact Information</h3>
          </div>

          {/* Whatsapp */}
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-3 border border-[#C6F6E5] mb-3 focus-within:border-[#00C896] transition-colors">
            <MessageSquare size={20} color="#00C896" className="mr-2.5 flex-shrink-0" />
            <input
              type="tel"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
          </div>

          {/* Facebook */}
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-3 border border-[#C6F6E5] mb-3 focus-within:border-[#00C896] transition-colors">
            <Facebook size={20} color="#3B82F6" className="mr-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Facebook Username"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
          </div>

          {/* Telegram */}
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-3 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896] transition-colors">
            <Send size={20} color="#38BDF8" className="mr-2.5 flex-shrink-0 -rotate-[15deg]" />
            <input
              type="text"
              placeholder="Telegram Handle"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
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
            onClick={handleSave} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00C896] to-[#009673] rounded-full h-[52px] flex justify-center items-center text-white text-base font-bold shadow-lg shadow-[#007A5E]/20 mt-4 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
