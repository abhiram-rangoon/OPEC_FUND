'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Landmark, Trash2, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import api from '@/services/api';

export default function WithdrawalAccountScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'bank' | 'upi'>('bank');

  // Form states
  const [accHolder, setAccHolder] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [confirmAcc, setConfirmAcc] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVerifyUpi = () => {
    if (upiId.length > 5 && upiId.includes('@')) {
      setUpiVerified(true);
    }
  };

  const handleSaveBank = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (activeTab === 'bank') {
      if (!accHolder || !accNumber || !confirmAcc || !ifscCode || !bankName) {
        setErrorMsg('Please fill out all bank fields.');
        return;
      }
      if (accNumber !== confirmAcc) {
        setErrorMsg('Account numbers do not match.');
        return;
      }
    } else {
      if (!upiId) {
        setErrorMsg('Please enter a UPI ID.');
        return;
      }
      if (!upiVerified) {
        setErrorMsg('Please verify your UPI ID first.');
        return;
      }
    }

    try {
      const payload = activeTab === 'bank'
        ? {
            withdrawal_bank: bankName,
            withdrawal_account: accNumber,
            withdrawal_ifsc: ifscCode,
            withdrawal_name: accHolder
          }
        : {
            withdrawal_bank: 'UPI Payment',
            withdrawal_account: upiId,
            withdrawal_ifsc: 'UPI',
            withdrawal_name: user?.full_name || 'UPI User'
          };

      const res = await api.put('/profile/update', payload);
      if (res.data) {
        await fetchProfile();
        setSuccessMsg('Withdrawal details updated.');
        setTimeout(() => {
          setModalVisible(false);
          setSuccessMsg('');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg('Failed to update bank details.');
    }
  };

  const handleDeleteBank = async () => {
    if (confirm('Are you sure you want to remove your withdrawal account?')) {
      try {
        await api.put('/profile/update', {
          withdrawal_bank: null,
          withdrawal_account: null,
          withdrawal_ifsc: null,
          withdrawal_name: null
        });
        await fetchProfile();
        alert('Account removed.');
      } catch (err) {
        alert('Failed to remove account.');
      }
    }
  };

  const hasAccount = !!user?.withdrawal_account;

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">Withdrawal Account</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        {!hasAccount ? (
          <div className="flex flex-col items-center justify-center py-[60px]">
            <div className="w-[140px] h-[140px] rounded-full bg-[#E6FFF7] flex justify-center items-center mb-5">
              <Landmark size={64} color="#00C896" />
            </div>
            <h2 className="text-base font-bold text-[#0D1F1A] mb-2">No Account Bound</h2>
            <p className="text-[13px] text-[#9ABFB5] text-center leading-[1.4] mx-6 mb-6">
              Add your bank account or UPI ID to withdraw funds from your OPEC OilFund wallet safely.
            </p>
            <button 
              onClick={() => setModalVisible(true)}
              className="flex items-center bg-[#00C896] rounded-full px-6 py-3 shadow-lg shadow-[#007A5E]/20 hover:bg-[#009673] transition-colors"
            >
              <Plus size={18} color="#FFFFFF" className="mr-2" />
              <span className="text-sm font-bold text-white">Add Account</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 shadow-sm shadow-[#00C896]/10 border border-[#E6FFF7]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Landmark size={24} color="#00C896" />
                <h3 className="text-base font-bold text-[#0D1F1A] ml-3">{user?.withdrawal_bank || 'Bank'}</h3>
              </div>
              <div className="bg-[#E6FFF7] px-2.5 py-1 rounded-md">
                <span className="text-[11px] font-bold text-[#00C896]">ACTIVE</span>
              </div>
            </div>

            <p className="text-xl font-bold text-[#007A5E] mb-2 font-mono tracking-wider">
              {user?.withdrawal_account?.replace(/.(?=.{4})/g, '*')}
            </p>
            <p className="text-[13px] text-[#4A7C6F] mt-1 uppercase">
              {user?.withdrawal_name || user?.full_name}
            </p>

            <div className="flex justify-between items-center border-t border-[#F0FBF7] pt-4 mt-4">
              <button 
                onClick={() => setModalVisible(true)}
                className="rounded-lg border-[1.5px] border-[#00C896] px-5 py-1.5 hover:bg-[#F0FBF7] transition-colors"
              >
                <span className="text-xs font-bold text-[#00C896]">Modify</span>
              </button>
              <button 
                onClick={handleDeleteBank}
                className="w-9 h-9 rounded-lg bg-red-100 flex justify-center items-center hover:bg-red-200 transition-colors"
              >
                <Trash2 size={16} color="#EF4444" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#0D1F1A]/50">
          <div className="bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#0D1F1A]">Bind Account</h2>
              <button onClick={() => setModalVisible(false)} className="p-1">
                <X size={24} color="#0D1F1A" />
              </button>
            </div>

            <div className="flex bg-[#F0FBF7] rounded-full p-1 mb-5">
              <button 
                onClick={() => setActiveTab('bank')}
                className={`flex-1 py-2 text-[13px] font-bold rounded-full transition-colors ${activeTab === 'bank' ? 'bg-[#00C896] text-white' : 'text-[#4A7C6F]'}`}
              >
                Bank Transfer
              </button>
              <button 
                onClick={() => setActiveTab('upi')}
                className={`flex-1 py-2 text-[13px] font-bold rounded-full transition-colors ${activeTab === 'upi' ? 'bg-[#00C896] text-white' : 'text-[#4A7C6F]'}`}
              >
                UPI Details
              </button>
            </div>

            <div className="mb-4">
              {activeTab === 'bank' ? (
                <>
                  <label className="block text-xs font-bold text-[#4A7C6F] mb-2">Account Holder Name</label>
                  <div className="bg-[#E6FFF7] rounded-xl h-12 flex items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896]">
                    <input type="text" placeholder="As per bank records" value={accHolder} onChange={(e) => setAccHolder(e.target.value)} className="w-full bg-transparent text-sm text-[#0D1F1A] outline-none" />
                  </div>

                  <label className="block text-xs font-bold text-[#4A7C6F] mb-2">Account Number</label>
                  <div className="bg-[#E6FFF7] rounded-xl h-12 flex items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896]">
                    <input type="text" placeholder="Enter Bank Account Number" value={accNumber} onChange={(e) => setAccNumber(e.target.value)} className="w-full bg-transparent text-sm text-[#0D1F1A] outline-none" />
                  </div>

                  <label className="block text-xs font-bold text-[#4A7C6F] mb-2">Re-enter Account Number</label>
                  <div className="bg-[#E6FFF7] rounded-xl h-12 flex items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896]">
                    <input type="text" placeholder="Confirm Account Number" value={confirmAcc} onChange={(e) => setConfirmAcc(e.target.value)} className="w-full bg-transparent text-sm text-[#0D1F1A] outline-none" />
                  </div>

                  <label className="block text-xs font-bold text-[#4A7C6F] mb-2">IFSC Code</label>
                  <div className="bg-[#E6FFF7] rounded-xl h-12 flex items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896]">
                    <input type="text" placeholder="e.g. SBIN0001234" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="w-full bg-transparent text-sm text-[#0D1F1A] outline-none uppercase" />
                  </div>

                  <label className="block text-xs font-bold text-[#4A7C6F] mb-2">Bank Name</label>
                  <div className="bg-[#E6FFF7] rounded-xl h-12 flex items-center px-4 border border-[#C6F6E5] mb-4 focus-within:border-[#00C896]">
                    <input type="text" placeholder="e.g. State Bank of India" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full bg-transparent text-sm text-[#0D1F1A] outline-none" />
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-xs font-bold text-[#4A7C6F] mb-2">UPI ID</label>
                  <div className="flex items-center mb-4">
                    <div className="flex-1 bg-[#E6FFF7] rounded-xl h-12 flex items-center px-4 border border-[#C6F6E5] focus-within:border-[#00C896]">
                      <input 
                        type="text" 
                        placeholder="e.g. username@upi" 
                        value={upiId} 
                        onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }} 
                        className="w-full bg-transparent text-sm text-[#0D1F1A] outline-none" 
                      />
                    </div>
                    <button 
                      onClick={handleVerifyUpi}
                      className="ml-2.5 bg-[#E6FFF7] h-12 rounded-xl px-4 border border-[#00C896] hover:bg-[#C6F6E5] transition-colors"
                    >
                      <span className="text-[13px] font-bold text-[#007A5E]">{upiVerified ? 'Verified' : 'Verify'}</span>
                    </button>
                  </div>
                </>
              )}
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
              onClick={handleSaveBank}
              className="w-full bg-gradient-to-r from-[#00C896] to-[#009673] rounded-full h-[52px] flex justify-center items-center text-white text-base font-bold shadow-lg shadow-[#007A5E]/20 mt-2 mb-8 hover:opacity-90 transition-opacity"
            >
              Save Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
