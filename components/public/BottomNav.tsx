'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Images, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/gallery', label: 'Gallery', icon: Images },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Safe area background for notched phones */}
      <div className="bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-safe">
        <div className="flex items-stretch">
          {tabs.map((tab) => {
            const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center py-2 pt-3 relative group"
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-[#FF7A00]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    'flex flex-col items-center gap-1 transition-colors duration-200',
                    active ? 'text-[#FF7A00]' : 'text-gray-400 group-active:text-gray-600'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200',
                    active ? 'bg-[#FF7A00]/10' : ''
                  )}>
                    <tab.icon className={cn('w-5 h-5', active ? 'stroke-[2.5]' : 'stroke-[1.5]')} />
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold tracking-wide leading-none pb-1',
                    active ? 'text-[#FF7A00]' : 'text-gray-400'
                  )}>
                    {tab.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
