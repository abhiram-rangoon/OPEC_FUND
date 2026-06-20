'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const token = useAppStore((state) => state.token);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!token && pathname !== '/auth') {
        router.push('/auth');
      } else if (token && pathname === '/auth') {
        router.push('/');
      }
    }
  }, [mounted, token, pathname, router]);

  if (!mounted) return <div className="h-screen w-screen bg-[#F0FBF7] flex items-center justify-center">Loading...</div>;

  return <>{children}</>;
}
