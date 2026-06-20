'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function NotificationScreen() {
  const router = useRouter();
  const notifications = useAppStore((state) => state.notifications);
  const fetchNotifications = useAppStore((state) => state.fetchNotifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    };
    loadNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markNotificationRead(id);
  };

  const handleCardClick = async (id: string, is_read: boolean) => {
    if (!is_read) {
      await markNotificationRead(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF7] relative">
      {/* Header */}
      <div className="bg-[#007A5E] h-[100px] flex items-center justify-between px-4 pt-10 rounded-b-3xl shadow-md fixed top-0 w-full max-w-md z-20">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors">
          <ChevronLeft color="#FFFFFF" size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">Notifications</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="pt-[116px] px-4 pb-10">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C896]"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell size={48} color="#9ABFB5" className="mb-3" />
            <p className="text-[#4A7C6F] text-sm">No notifications found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleCardClick(item.id, item.is_read)}
                className={`rounded-[16px] p-4 cursor-pointer transition-all border ${
                  item.is_read 
                    ? 'bg-white border-[#E6FFF7] shadow-sm shadow-[#00C896]/5' 
                    : 'bg-[#FAFDFD] border-[#00C896] shadow-md shadow-[#00C896]/10'
                }`}
              >
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center flex-1 pr-2">
                    <div className={`w-8 h-8 rounded-lg flex justify-center items-center mr-2.5 flex-shrink-0 ${item.is_read ? 'bg-[#E6FFF7]' : 'bg-[#00C896]'}`}>
                      <Bell size={16} color={item.is_read ? '#00C896' : '#FFFFFF'} />
                    </div>
                    <h3 className={`text-[15px] font-bold truncate ${item.is_read ? 'text-[#0D1F1A]' : 'text-[#007A5E]'}`}>
                      {item.title}
                    </h3>
                  </div>
                  {!item.is_read && (
                    <div className="bg-red-500 px-2 py-0.5 rounded-full flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">New</span>
                    </div>
                  )}
                </div>

                <p className="text-[13px] text-[#4A7C6F] leading-[1.4] mb-3">
                  {item.message}
                </p>

                <div className="flex justify-between items-center border-t border-[#F0FBF7] pt-2">
                  <span className="text-[11px] text-[#9ABFB5]">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {!item.is_read && (
                    <button 
                      onClick={(e) => handleMarkRead(item.id, e)}
                      className="flex items-center text-[#00C896] hover:text-[#007A5E] transition-colors"
                    >
                      <CheckCircle2 size={12} className="mr-1" />
                      <span className="text-[11px] font-bold">Mark read</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
