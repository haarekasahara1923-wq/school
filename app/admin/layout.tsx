'use client';
import Sidebar from '@/components/admin/Sidebar';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/admin/ToastContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="h-screen bg-gray-50 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 overflow-y-auto h-full w-full">
            {children}
          </main>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
