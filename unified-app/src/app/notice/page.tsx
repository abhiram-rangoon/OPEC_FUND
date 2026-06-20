'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Filter } from 'lucide-react';
import Link from 'next/link';

export const NOTICES_DATA = [
  {
    id: '1',
    category: 'Updates',
    title: 'OPEC Sovereign Oil Fund Rules v4.2',
    date: 'June 18, 2026',
    time: '16:07',
    preview: 'We have updated the daily interest distribution schedules. Reinvestment pools will now distribute returns at 00:00 UTC daily.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    content: 'We have updated the daily interest distribution schedules. Reinvestment pools will now distribute returns at 00:00 UTC daily. All sovereign products can be bought under the standard limits (Max 3 contracts per user). VIP members receive priority settlement access.'
  },
  {
    id: '2',
    category: 'Market',
    title: 'El Mero Wind Farm Phase 2 Completion',
    date: 'June 15, 2026',
    time: '23:44',
    preview: 'We are thrilled to announce El Mero offshore installations are 100% complete and connected to regional grids.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    content: 'We are thrilled to announce El Mero offshore installations are 100% complete and connected to the main regional power grids. Investors holding active El Mero contracts will receive an extra 2.5% dividend payout this weekend.'
  },
  {
    id: '3',
    category: 'Events',
    title: 'Anti-Fraud & AML Compliance Announcement',
    date: 'June 10, 2026',
    time: '00:00',
    preview: 'To secure user portfolios, each investor is strictly limited to one account and one bound bank card.',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    content: 'To secure user portfolios, each investor is strictly limited to one account and one bound bank card. Anyone running multiple accounts or binding identical bank details to multiple IDs will have their balance frozen pending verification.'
  }
];

const CATEGORIES = ['All', 'Updates', 'Market', 'Events'];

export default function NoticeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredNotices = NOTICES_DATA.filter(n => 
    activeCategory === 'All' ? true : n.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">Notices</h1>
        <button className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <Filter color="#FFFFFF" size={22} />
        </button>
      </div>

      <div className="pt-[116px] pb-10">
        {/* Categories Horizontal Scroll */}
        <div className="overflow-x-auto no-scrollbar mb-4 px-4">
          <div className="flex w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full mr-2 text-[13px] font-bold border transition-colors ${
                    isActive 
                      ? 'bg-[#00C896] border-[#00C896] text-white' 
                      : 'bg-white border-[#E6FFF7] text-[#4A7C6F] hover:bg-[#F0FBF7]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notice List */}
        <div className="px-4 space-y-4">
          {filteredNotices.map((item) => (
            <Link 
              href={`/notice/${item.id}`}
              key={item.id} 
              className="block bg-white rounded-[20px] overflow-hidden border border-[#E6FFF7] shadow-sm shadow-[#00C896]/5 hover:shadow-md transition-shadow"
            >
              <div className="h-[180px] relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-[#007A5E]/75 px-4 py-2.5 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                </div>
              </div>

              <div className="flex justify-between items-center px-4 pt-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-1.5" />
                  <span className="text-xs font-bold text-[#007A5E]">OilFund</span>
                </div>
                <span className="text-[11px] text-[#9ABFB5]">{item.date} {item.time}</span>
              </div>

              <div className="px-4 pb-4 pt-1.5">
                <p className="text-xs text-[#4A7C6F] leading-[1.5] line-clamp-2">{item.preview}</p>
              </div>
            </Link>
          ))}
          {filteredNotices.length === 0 && (
            <div className="text-center py-10 text-sm text-[#4A7C6F]">
              No notices found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
