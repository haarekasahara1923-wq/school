import { auth } from '@/lib/auth';
import { db } from '@/db';
import { students, staff, feePayments, admissionEnquiries, contactEnquiries } from '@/db/schema';
import { count, eq, sql } from 'drizzle-orm';
import { Users, UserCheck, CreditCard, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function AdminDashboard() {
  const session = await auth();

  let studentCount = 0;
  let staffCount = 0;
  let totalRevenue = 0;
  let pendingAdmissions = 0;
  let newEnquiries = 0;

  try {
    const [sCount] = await db.select({ count: count() }).from(students).where(eq(students.isDeleted, false));
    studentCount = Number(sCount?.count || 0);

    const [stCount] = await db.select({ count: count() }).from(staff).where(eq(staff.isDeleted, false));
    staffCount = Number(stCount?.count || 0);

    const [rev] = await db.select({ total: sql<string>`SUM(amount_paid)` }).from(feePayments);
    totalRevenue = Number(rev?.total || 0);

    const [admCount] = await db.select({ count: count() }).from(admissionEnquiries).where(eq(admissionEnquiries.status, 'new'));
    pendingAdmissions = Number(admCount?.count || 0);

    const [cCount] = await db.select({ count: count() }).from(contactEnquiries).where(eq(contactEnquiries.status, 'new'));
    newEnquiries = Number(cCount?.count || 0);
  } catch {}

  const stats = [
    { title: 'Total Students', value: studentCount, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Staff', value: staffCount, icon: UserCheck, color: 'bg-emerald-500' },
    { title: 'Total Fee Revenue', value: formatCurrency(totalRevenue), icon: CreditCard, color: 'bg-[#FF7A00]' },
    { title: 'New Admission Enquiries', value: pendingAdmissions, icon: FileText, color: 'bg-purple-500' },
    { title: 'New Contact Messages', value: newEnquiries, icon: MessageSquare, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6b] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold">Welcome back, {session?.user?.name || 'Admin'}! 👋</h1>
          <p className="text-white/70 mt-1">Here is what is happening at Progressive Smart Kids School today.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-sm">
          Role: <span className="text-[#FF7A00] font-semibold capitalize">{(session?.user as any)?.role || 'Admin'}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">{stat.title}</span>
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0A1F44]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-[#FF7A00]" />
            <h3 className="font-semibold text-[#0A1F44]">Quick Tasks</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Check and process new admission enquiries</li>
            <li>• Record daily fee collections</li>
            <li>• Update gallery album photos</li>
            <li>• Manage staff attendance & payroll</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
