import { auth } from '@/lib/auth';
import Link from 'next/link';
import { Images, Settings, GraduationCap, ArrowRight, Camera, Sliders } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();
  const adminName = session?.user?.name || 'Admin';

  const quickActions = [
    {
      href: '/admin/gallery',
      icon: Images,
      label: 'Gallery',
      description: 'Upload photos and videos to the school gallery. They appear on the website instantly.',
      accentColor: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      hoverBorder: 'hover:border-blue-300',
      badge: 'Photos & Videos',
      badgeBg: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'School Settings',
      description: 'Update school name, address, contact info, and Director / Principal profiles.',
      accentColor: 'from-[#FF7A00] to-[#E06500]',
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FF7A00]',
      borderColor: 'border-orange-100',
      hoverBorder: 'hover:border-orange-300',
      badge: 'Info & Leadership',
      badgeBg: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0A1F44] via-[#13336b] to-[#0A1F44] rounded-3xl p-8 text-white shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -right-4 w-64 h-64 rounded-full bg-[#FF7A00]/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#E06500] flex items-center justify-center shadow-lg shadow-orange-500/40 shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm mb-0.5">Welcome back 👋</p>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white leading-tight">
                {adminName}
              </h1>
              <p className="text-white/50 text-sm mt-1">Progressive Smart Kids School — Admin Panel</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Role</p>
            <p className="text-[#FF7A00] font-bold text-sm capitalize">
              {(session?.user as any)?.role || 'Administrator'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Label */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pl-1">What would you like to do?</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group relative flex flex-col bg-white rounded-3xl p-7 shadow-sm border ${action.borderColor} ${action.hoverBorder} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Decorative gradient blob */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${action.accentColor} opacity-5 -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity`} />

              <div className="relative z-10 flex flex-col h-full gap-4">
                {/* Icon + Badge row */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${action.badgeBg}`}>
                    {action.badge}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#0A1F44] mb-2">{action.label}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{action.description}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0A1F44] group-hover:text-[#FF7A00] transition-colors">
                  Open {action.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0A1F44]">Changes appear on the website instantly</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Any photos, videos, or settings you save here will be reflected on the public website in real-time — no rebuild needed.
          </p>
        </div>
      </div>
    </div>
  );
}
