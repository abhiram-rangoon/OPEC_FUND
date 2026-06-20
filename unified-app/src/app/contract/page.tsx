'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Award, Download } from 'lucide-react';

const SECTIONS = [
  {
    id: 'I',
    title: 'PARTIES & DEFINITIONS',
    body: 'This Cooperation & Clean Energy Investment Agreement is entered between the registered account holder, hereinafter referred to as "the Investor," and the OPEC Sovereign Clean Energy Development Pool, hereinafter referred to as "the Fund."'
  },
  {
    id: 'II',
    title: 'CAPITAL DEPLOYMENT',
    body: 'The Investor pledges discretionary capital to finance sustainable infrastructural projects (e.g. offshore grid turbines, solar farms, and geothermal collectors) to earn daily interest yields under defined product schedules.'
  },
  {
    id: 'III',
    title: 'DISTRIBUTION & DIVIDENDS',
    body: 'Earnings will be distributed automatically at 00:00 UTC daily. Yield rates are governed by global grid outputs. The Fund provides 100% insurance guarantees on the initial deployed principal.'
  },
  {
    id: 'IV',
    title: 'COMPLIANCE & ANTI-MONEY LAUNDERING',
    body: 'To secure platform liquidity and conform to anti-fraud laws, the Investor shall link only one validated bank account or UPI ID. Any duplication of bank cards across accounts results in an immediate audit freeze.'
  },
  {
    id: 'V',
    title: 'TERM & LIQUIDATION',
    body: 'This agreement terminates automatically upon expiration of the product term. At expiration, the Fund returns the total principal to the withdrawable balance.'
  }
];

export default function ContractScreen() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleAgree = () => {
    setSuccessMsg('Digital contract signed successfully!');
    setTimeout(() => router.back(), 2000);
  };

  const handleDownload = () => {
    setInfoMsg('Exporting digital copy to files...');
    setTimeout(() => setInfoMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">Investment Contract</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="pt-[116px] px-4 pb-10 overflow-y-auto">
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm text-center font-medium border border-green-100">
            {successMsg}
          </div>
        )}
        {infoMsg && (
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-4 text-sm text-center font-medium border border-blue-100">
            {infoMsg}
          </div>
        )}

        {/* Seal section */}
        <div className="flex flex-col items-center my-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#E6FFF7] border-[2.5px] border-[#00C896] flex justify-center items-center mb-3">
            <Award size={40} color="#007A5E" />
          </div>
          <h2 className="text-sm font-bold text-[#0D1F1A] tracking-wider text-center">OPEC CLEAN ENERGY INITIATIVE</h2>
          <p className="text-[10px] font-semibold text-[#9ABFB5] mt-1 text-center">MUTUAL COOPERATION & INVESTMENT AGREEMENT</p>
        </div>

        {/* Section Cards */}
        <div className="space-y-4 mb-6">
          {SECTIONS.map((sec) => (
            <div key={sec.id} className="bg-white rounded-[16px] p-5 border-t-[3px] border-[#00C896] shadow-sm shadow-[#00C896]/5">
              <div className="flex items-center mb-2.5">
                <div className="bg-[#00C896] w-6 h-6 rounded-full flex justify-center items-center mr-2.5 flex-shrink-0">
                  <span className="text-white text-xs font-bold">{sec.id}</span>
                </div>
                <h3 className="text-[13px] font-bold text-[#0D1F1A]">{sec.title}</h3>
              </div>
              <p className="text-[13px] text-[#4A7C6F] leading-[1.5] text-justify">
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex justify-between space-x-3 mt-4">
          <button 
            onClick={handleAgree} 
            className="flex-[1.2] bg-[#00C896] h-12 rounded-full flex justify-center items-center text-white text-[15px] font-bold shadow-md shadow-[#007A5E]/10 hover:bg-[#009673] transition-colors"
          >
            I Agree
          </button>
          <button 
            onClick={handleDownload} 
            className="flex-1 bg-white border-[1.5px] border-[#00C896] h-12 rounded-full flex justify-center items-center text-[#00C896] text-sm font-bold hover:bg-[#F0FBF7] transition-colors"
          >
            <Download size={16} color="#00C896" className="mr-1.5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
