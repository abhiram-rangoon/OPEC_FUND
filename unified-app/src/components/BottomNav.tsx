'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Crown, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/projects', icon: BarChart2, label: 'Project' },
    { href: '/vip', icon: Crown, label: 'VIP' },
    { href: '/profile', icon: User, label: 'Me' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white shadow-[0_-4px_12px_rgba(0,200,150,0.08)] flex justify-between items-center px-6 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center justify-center w-16 h-full"
          >
            <Icon size={24} color={isActive ? '#00C896' : '#9ABFB5'} />
            <span className={`text-xs font-bold mt-1 ${isActive ? 'text-[#00C896]' : 'text-[#9ABFB5]'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
