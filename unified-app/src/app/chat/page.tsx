'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquare, Plus, CheckCircle, Send, Users, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const FAQS = [
  { q: 'How long does withdrawal take?', a: 'Withdrawals are typically processed within 2-4 hours during business hours (Mon-Thu 10:00-16:00). Outside these hours, it may take up to 24 hours.' },
  { q: 'How do I upgrade my VIP Level?', a: 'Your VIP level automatically upgrades when you reach the required number of direct active A-level referrals. Check the VIP section for specific tier requirements.' },
  { q: 'What happens when a project completes?', a: 'The principal amount and any remaining daily interest will be automatically credited to your wallet balance on the exact expiry day.' }
];

export default function ChatScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', type: 'agent', text: 'Welcome to OPEC OilFund Support. How can we assist you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const handleSend = () => {
    if (!msg.trim()) return;
    
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      text: msg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setMsg('');

    // Simulate Agent reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        text: 'Thank you for reaching out. An agent will be with you shortly. For immediate help, please check our FAQ section.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {!chatOpen ? (
        <>
          {/* Main Support Center View */}
          <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
              <ChevronLeft color="#FFFFFF" size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">Support Center</h1>
            <div className="w-10 h-10" />
          </div>

          <div className="pt-[116px] px-4 pb-10">
            {/* Top Info Card */}
            <div className="bg-white rounded-[20px] p-5 mb-6 shadow-sm shadow-[#00C896]/10 flex justify-between items-center">
              <div>
                <p className="text-[15px] font-bold text-[#0D1F1A] mb-1">Hi, {user?.full_name || 'Member'} 👋</p>
                <p className="text-xs text-[#9ABFB5]">How can we help you today?</p>
              </div>
              <button 
                onClick={() => setChatOpen(true)}
                className="bg-[#00C896] hover:bg-[#009673] transition-colors rounded-full flex items-center px-4 py-2 shadow-sm shadow-[#00C896]/20"
              >
                <MessageSquare size={16} color="#FFFFFF" className="mr-1.5" />
                <span className="text-xs font-bold text-white">Live Chat</span>
              </button>
            </div>

            <div className="w-full h-px bg-[#E6FFF7] mb-6" />

            <h2 className="text-[15px] font-bold text-[#0D1F1A] mb-4 px-1">Direct Contact Options</h2>
            
            <div className="space-y-3 mb-8">
              <div className="bg-white rounded-[16px] p-4 flex items-center shadow-sm shadow-[#00C896]/5">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex justify-center items-center mr-3">
                  <Smartphone size={20} color="#25D366" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-bold text-[#0D1F1A]">WhatsApp Support</h3>
                  <p className="text-[11px] text-[#9ABFB5] mt-0.5">Response time: ~5 mins</p>
                </div>
                <button className="border-[1.5px] border-[#00C896] rounded-full px-4 py-1.5 hover:bg-[#F0FBF7] transition-colors">
                  <span className="text-xs font-bold text-[#00C896]">Connect</span>
                </button>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex items-center shadow-sm shadow-[#00C896]/5">
                <div className="w-10 h-10 rounded-xl bg-[#0088CC]/10 flex justify-center items-center mr-3">
                  <Globe size={20} color="#0088CC" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-bold text-[#0D1F1A]">Official Telegram</h3>
                  <p className="text-[11px] text-[#9ABFB5] mt-0.5">Join community channel</p>
                </div>
                <button className="border-[1.5px] border-[#00C896] rounded-full px-4 py-1.5 hover:bg-[#F0FBF7] transition-colors">
                  <span className="text-xs font-bold text-[#00C896]">Join</span>
                </button>
              </div>
            </div>

            <h2 className="text-[15px] font-bold text-[#0D1F1A] mb-4 px-1">Frequently Asked Questions</h2>
            
            <div className="space-y-2.5">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-[16px] p-4 shadow-sm shadow-[#00C896]/5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[13px] font-bold text-[#0D1F1A] pr-2">{faq.q}</h3>
                  </div>
                  <div className="pt-2 border-t border-[#F0FBF7]">
                    <p className="text-xs text-[#4A7C6F] leading-[1.5]">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Live Chat Modal View */}
          <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 fixed top-0 w-full max-w-md z-30 shadow-md">
            <button onClick={() => setChatOpen(false)} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
              <ChevronLeft color="#FFFFFF" size={24} />
            </button>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#00C896] mr-2" />
              <h1 className="text-white text-base font-bold">Support Agent</h1>
            </div>
            <div className="w-10 h-10" />
          </div>

          <div className="pt-[100px] pb-[76px] px-4 h-screen flex flex-col overflow-y-auto bg-[#F0FBF7]">
            <div className="flex-1 py-4 space-y-4">
              {chatHistory.map((c) => (
                <div key={c.id} className={`flex ${c.type === 'agent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-[16px] px-3.5 py-2.5 ${
                    c.type === 'agent' 
                      ? 'bg-white rounded-tl-none border border-[#E6FFF7] shadow-sm shadow-[#00C896]/5' 
                      : 'bg-[#00C896] rounded-tr-none shadow-md shadow-[#00C896]/20'
                  }`}>
                    <p className={`text-sm leading-[1.4] ${c.type === 'agent' ? 'text-[#0D1F1A]' : 'text-white'}`}>
                      {c.text}
                    </p>
                    <div className="flex justify-end mt-1">
                      <span className={`text-[9px] ${c.type === 'agent' ? 'text-[#9ABFB5]' : 'text-[#E6FFF7]'}`}>
                        {c.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="fixed bottom-0 w-full max-w-md bg-white p-3 border-t border-[#E6FFF7] flex items-center z-30">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-12 bg-[#F0FBF7] rounded-full px-4 text-sm text-[#0D1F1A] border border-[#C6F6E5] focus:border-[#00C896] outline-none mr-2 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!msg.trim()}
              className="w-12 h-12 rounded-full bg-[#00C896] flex justify-center items-center disabled:opacity-50 hover:bg-[#009673] transition-colors"
            >
              <Send size={20} color="#FFFFFF" className="-ml-0.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
