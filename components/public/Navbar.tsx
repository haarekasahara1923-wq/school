'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A1F44]/95 backdrop-blur-md shadow-lg shadow-navy/20'
          : 'bg-[#0A1F44] shadow-md'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E06500] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="font-playfair font-bold text-white text-xs sm:text-sm leading-tight">Progressive Smart Kids</p>
              <p className="text-orange-300 text-[10px] sm:text-xs">School, Gwalior (MP)</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-[#FF7A00] bg-orange-500/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Phone (mobile) + Enquire (desktop) */}
          <div className="flex items-center gap-2">
            {/* Mobile: direct call button */}
            <a
              href="tel:8962678915"
              className="lg:hidden flex items-center gap-1.5 bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-xs font-semibold px-3 py-2 rounded-full transition-colors hover:bg-[#FF7A00]/30"
              aria-label="Call school"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            {/* Desktop: phone + enquire button */}
            <a
              href="tel:8962678915"
              className="hidden lg:flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-[#FF7A00]" />
              8962678915
            </a>
            <Link
              href="/contact"
              className="hidden lg:block btn-primary text-sm px-5 py-2"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Active page underline on mobile — for the top bar */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-[#FF7A00] to-transparent hidden"
        layoutId="navUnderline"
      />
    </header>
  );
}
