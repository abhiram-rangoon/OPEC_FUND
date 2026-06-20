'use client';
import React, { useState } from 'react';
import { Phone, Lock, User, UserPlus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('7702858070');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [localError, setLocalError] = useState('');

  const loginAction = useAppStore((state) => state.login);
  const registerAction = useAppStore((state) => state.register);
  const isLoading = useAppStore((state) => state.isLoading);
  const errorMsg = useAppStore((state) => state.error);

  const handleSubmit = async () => {
    setLocalError('');
    if (!phone || !password) {
      setLocalError('Please fill all mandatory fields.');
      return;
    }

    if (isLogin) {
      const success = await loginAction(phone, password);
      if (!success) {
        setLocalError(errorMsg || 'Login failed.');
      }
    } else {
      if (!fullName) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setLocalError('You must agree to the Terms.');
        return;
      }
      const success = await registerAction(fullName, phone, password, referralCode);
      if (!success) {
        setLocalError(errorMsg || 'Registration failed.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] flex flex-col items-center pt-16 px-5 relative">
      {/* Background Decorative SVG feel */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#00C896] opacity-10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#007A5E] opacity-5 blur-xl pointer-events-none" />

      {/* Logo Card */}
      <div className="flex flex-col items-center mb-6 z-10">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg text-4xl font-black text-[#00C896]">
          OF
        </div>
      </div>

      <div className="bg-white w-full rounded-3xl p-6 shadow-xl z-10">
        <h1 className="text-2xl font-bold text-center text-[#0D1F1A] mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-sm text-center text-[#4A7C6F] mb-6">
          {isLogin ? 'Sign in to access your green portfolio reserves' : 'Register to start clean energy investments'}
        </p>

        {(localError || errorMsg) && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {localError || errorMsg}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {!isLogin && (
            <div className="flex items-center bg-[#F4F9F7] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#00C896]">
              <User size={20} color="#4A7C6F" className="mr-3" />
              <input
                type="text"
                placeholder="Full Name"
                className="bg-transparent flex-1 outline-none text-[#0D1F1A] placeholder-[#9ABFB5]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center">
            <div className="h-[48px] bg-[#E6FFF7] rounded-xl flex items-center justify-center px-3 mr-2 border border-transparent">
              <span className="text-[15px] font-bold text-[#0D1F1A]">🇮🇳 +91</span>
            </div>
            <div className="flex-1 flex items-center bg-[#F4F9F7] rounded-xl px-4 h-[48px] border border-transparent focus-within:border-[#00C896]">
              <Phone size={20} color="#4A7C6F" className="mr-3" />
              <input
                type="tel"
                placeholder="Phone Number"
                className="bg-transparent flex-1 outline-none text-[#0D1F1A] placeholder-[#9ABFB5]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center bg-[#F4F9F7] rounded-xl px-4 h-[48px] border border-transparent focus-within:border-[#00C896]">
            <Lock size={20} color="#4A7C6F" className="mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent flex-1 outline-none text-[#0D1F1A] placeholder-[#9ABFB5]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <>
              <div className="flex items-center bg-[#F4F9F7] rounded-xl px-4 h-[48px] border border-transparent focus-within:border-[#00C896]">
                <Lock size={20} color="#4A7C6F" className="mr-3" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="bg-transparent flex-1 outline-none text-[#0D1F1A] placeholder-[#9ABFB5]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-[#F4F9F7] rounded-xl px-4 h-[48px] border border-transparent focus-within:border-[#00C896]">
                <UserPlus size={20} color="#4A7C6F" className="mr-3" />
                <input
                  type="text"
                  placeholder="Referral Code (Optional)"
                  className="bg-transparent flex-1 outline-none text-[#0D1F1A] placeholder-[#9ABFB5]"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
              <label className="flex items-center mt-2 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded flex justify-center items-center mr-3 border-2 transition-colors ${agreeTerms ? 'bg-[#00C896] border-[#00C896]' : 'border-[#9ABFB5]'}`}
                  onClick={(e) => { e.preventDefault(); setAgreeTerms(!agreeTerms); }}
                >
                  {agreeTerms && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className="text-[#4A7C6F] text-sm">I agree to the Terms & Conditions</span>
              </label>
            </>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <button className="text-sm font-bold text-[#00C896] hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-4 h-12 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-[#00C896] to-[#009673] shadow-lg shadow-[#00C896]/30 hover:opacity-90 transition-opacity flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setLocalError('');
            }}
            className="text-[15px] font-bold text-[#007A5E] hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
