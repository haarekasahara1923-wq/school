'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard, Users, CreditCard, UserCheck, Images,
  FileText, MessageSquare, Award, Info, Settings, LogOut,
  GraduationCap, ChevronRight, Package, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'accountant', 'operations', 'inventory'] },
  { href: '/admin/students', label: 'Students', icon: Users, roles: ['admin', 'accountant', 'operations'] },
  { href: '/admin/fees', label: 'Fee Management', icon: CreditCard, roles: ['admin', 'accountant'] },
  { href: '/admin/staff', label: 'Staff & Payroll', icon: UserCheck, roles: ['admin', 'accountant', 'operations'] },
  { href: '/admin/gallery', label: 'Gallery', icon: Images, roles: ['admin', 'operations'] },
  { href: '/admin/admissions', label: 'Admissions', icon: FileText, roles: ['admin', 'operations'] },
  { href: '/admin/contact', label: 'Enquiries', icon: MessageSquare, roles: ['admin', 'operations'] },
  { href: '/admin/certifications', label: 'Certifications', icon: Award, roles: ['admin', 'operations'] },
  { href: '/admin/inventory', label: 'Inventory', icon: Package, roles: ['admin', 'operations', 'inventory'] },
  { href: '/admin/about', label: 'About Content', icon: Info, roles: ['admin', 'operations'] },
  { href: '/admin/users', label: 'User Management', icon: Shield, roles: ['admin'] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'operations';

  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#0A1F44] text-white h-screen flex flex-col justify-between p-4 fixed left-0 top-0 bottom-0 z-40 overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E06500] flex items-center justify-center shadow-lg shadow-orange-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-white text-sm">Progressive Smart Kids</h1>
            <p className="text-orange-300 text-xs capitalize">{userRole} Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {visibleItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between px-2 mb-3">
          <div>
            <p className="text-white text-sm font-medium">{session?.user?.name || 'User'}</p>
            <p className="text-white/40 text-xs">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
