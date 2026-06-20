'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2 } from 'lucide-react';
import { NOTICES_DATA } from '../page';

export default function NoticeDetailScreen({ params }: { params: { id: string } }) {
  const router = useRouter();
  const notice = NOTICES_DATA.find(n => n.id === params.id) || NOTICES_DATA[0];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: notice.title,
          text: `${notice.title}\n\n${notice.content}\n\nRead more on OPEC OilFund!`,
        });
      } else {
        await navigator.clipboard.writeText(`${notice.title}\n\n${notice.content}\n\nRead more on OPEC OilFund!`);
        alert('Copied to clipboard');
      }
    } catch (error: any) {
      console.log('Error sharing notice:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Top Image (full width) */}
      <div className="h-[240px] w-full relative">
        <img src={notice.image} alt={notice.title} className="w-full h-full object-cover" />
        
        {/* Floating Back and Share buttons */}
        <div className="absolute top-[50px] left-0 right-0 flex justify-between px-4 z-10">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 rounded-full bg-[#004D3D]/60 backdrop-blur-sm flex justify-center items-center hover:bg-[#004D3D]/80 transition-colors"
          >
            <ChevronLeft color="#FFFFFF" size={24} className="-ml-0.5" />
          </button>
          <button 
            onClick={handleShare} 
            className="w-10 h-10 rounded-full bg-[#004D3D]/60 backdrop-blur-sm flex justify-center items-center hover:bg-[#004D3D]/80 transition-colors"
          >
            <Share2 color="#FFFFFF" size={20} />
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold text-[#0D1F1A] leading-[1.4] mb-4">{notice.title}</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-[#E6FFF7] px-2.5 py-1 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-1.5" />
            <span className="text-[11px] font-bold text-[#007A5E]">OilFund Official</span>
          </div>
          <span className="text-[11px] text-[#9ABFB5]">{notice.date} {notice.time}</span>
        </div>

        <div className="h-px bg-[#F0FBF7] w-full mb-5" />

        <p className="text-sm text-[#4A7C6F] leading-[1.7] text-justify whitespace-pre-wrap">
          {notice.content}
        </p>
      </div>
    </div>
  );
}
