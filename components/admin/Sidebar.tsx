'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Images, Settings, LogOut, GraduationCap, ChevronRight, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/gallery', label: 'Gallery (Photos & Videos)', icon: Images },
  { href: '/admin/settings', label: 'School Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-[#0A1F44] text-white h-screen flex flex-col justify-between p-4 fixed left-0 top-0 bottom-0 z-40 overflow-y-auto border-r border-white/10 shadow-2xl">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E06500] flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-playfair font-bold text-white text-sm truncate">Progressive Smart Kids</h1>
            <p className="text-orange-300 text-xs">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30 font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Sign Out */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <div className="px-2">
          <p className="text-white text-sm font-semibold truncate">{session?.user?.name || 'Administrator'}</p>
          <p className="text-white/40 text-xs truncate">{session?.user?.email || 'admin@psks.space'}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
