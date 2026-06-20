'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import api from '@/services/api';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const evaluateStrength = (pass: string) => {
    if (!pass) return null;
    if (pass.length < 6) return 'weak';
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 'strong';
    return 'medium';
  };

  const strength = evaluateStrength(newPassword);

  const handleUpdate = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Confirm password does not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/profile/change-password', { password: newPassword });
      if (response.data?.message) {
        setSuccessMsg('Credentials updated successfully!');
        setTimeout(() => router.back(), 2000);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Could not change password.');
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
        <h1 className="text-white text-lg font-bold">Change Password</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        
        {/* Update Password Card */}
        <div className="bg-white rounded-[20px] p-5 mb-5 shadow-sm shadow-[#00C896]/10">
          <div className="flex items-center mb-5">
            <div className="w-9 h-9 rounded-full bg-[#E6FFF7] flex justify-center items-center mr-2.5">
              <Lock size={20} color="#00C896" />
            </div>
            <h2 className="text-sm font-bold text-[#007A5E]">Update Your Password</h2>
          </div>

          {/* Current Password */}
          <label className="block text-xs font-bold text-[#4A7C6F] mb-2">Current Password</label>
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896] transition-colors">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
            <button onClick={() => setShowCurrent(!showCurrent)} className="pl-2">
              {showCurrent ? <EyeOff size={18} color="#00C896" /> : <Eye size={18} color="#00C896" />}
            </button>
          </div>

          {/* New Password */}
          <label className="block text-xs font-bold text-[#4A7C6F] mb-2">New Password</label>
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-4 border border-[#C6F6E5] mb-2 focus-within:border-[#00C896] transition-colors">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
            <button onClick={() => setShowNew(!showNew)} className="pl-2">
              {showNew ? <EyeOff size={18} color="#00C896" /> : <Eye size={18} color="#00C896" />}
            </button>
          </div>

          {/* Strength Bar */}
          {strength && (
            <div className="flex items-center mb-4 mt-1">
              <div className={`h-1.5 w-[60px] rounded-full mr-2.5 ${
                strength === 'weak' ? 'bg-[#EF4444]' : 
                strength === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#00C896]'
              }`} />
              <span className={`text-[10px] font-bold uppercase ${
                strength === 'weak' ? 'text-[#EF4444]' : 
                strength === 'medium' ? 'text-[#F59E0B]' : 'text-[#00C896]'
              }`}>
                {strength}
              </span>
            </div>
          )}

          {/* Confirm Password */}
          <label className="block text-xs font-bold text-[#4A7C6F] mb-2">Confirm New Password</label>
          <div className="flex bg-[#E6FFF7] rounded-xl h-12 items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896] transition-colors">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#0D1F1A] outline-none placeholder:text-[#9ABFB5]"
            />
            <button onClick={() => setShowConfirm(!showConfirm)} className="pl-2">
              {showConfirm ? <EyeOff size={18} color="#00C896" /> : <Eye size={18} color="#00C896" />}
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
            onClick={handleUpdate} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00C896] to-[#009673] rounded-full h-[52px] flex justify-center items-center text-white text-[15px] font-bold shadow-md shadow-[#007A5E]/10 mt-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>

        {/* Security Tips Card */}
        <div className="bg-[#E6FFF7] rounded-[20px] p-5 border border-[#C6F6E5]">
          <div className="flex items-center mb-3">
            <ShieldAlert size={18} color="#007A5E" className="mr-1.5" />
            <h3 className="text-sm font-bold text-[#007A5E]">Security Tips</h3>
          </div>
          
          <div className="flex items-start mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-2 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#4A7C6F] leading-[1.5]">Use 8 or more characters in length.</p>
          </div>
          <div className="flex items-start mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-2 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#4A7C6F] leading-[1.5]">Mix uppercase letters, lowercase letters, numbers, and symbols.</p>
          </div>
          <div className="flex items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-2 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#4A7C6F] leading-[1.5]">Do not reuse passwords from other financial applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
