import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const whatsapp = process.env.ADMIN_WHATSAPP_NUMBER || '918962678915';

  return (
    <footer className="bg-[#060f22] text-white">
      {/* Top gradient divider */}
      <div className="h-1 bg-gradient-to-r from-[#FF7A00] via-[#FF9A3C] to-[#0A1F44]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E06500] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-playfair font-bold text-white text-sm leading-tight">Progressive Smart Kids</p>
                <p className="text-orange-300 text-xs">School, Gwalior (MP)</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Nurturing young minds with excellence in education, values, and holistic development. CBSE Affiliated | Class 1st to 12th.
            </p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-[#FF7A00]">Quick Links</h3>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/about', 'About Us'], ['/gallery', 'Gallery'], ['/contact', 'Contact Us']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#FF7A00] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-[#FF7A00]">Our Classes</h3>
            <ul className="space-y-2">
              {['Pre-Primary (Nursery, LKG, UKG)', 'Primary (Class 1–5)', 'Middle School (Class 6–8)', 'Secondary (Class 9–10)', 'Senior Secondary (Class 11–12)'].map((p) => (
                <li key={p}>
                  <span className="text-white/60 text-sm">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-[#FF7A00]">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF7A00] mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">Prani Chhavani, Gwalior (MP)</span>
              </li>
              <li>
                <a href="tel:8962678915" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-[#FF7A00] shrink-0" />
                  8962678915
                </a>
              </li>
              <li>
                <a href="mailto:info@progressivesmartkids.in" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-[#FF7A00] shrink-0" />
                  info@progressivesmartkids.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Progressive Smart Kids School. All rights reserved.</p>
          <p className="text-white/40 text-xs">Prani Chhavani, Gwalior (MP)</p>
        </div>
      </div>
    </footer>
  );
}
