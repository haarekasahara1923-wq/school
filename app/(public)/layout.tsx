import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp';
import BottomNav from '@/components/public/BottomNav';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* pb-20 on mobile to avoid content hidden behind BottomNav */}
      <main className="pb-20 lg:pb-0">{children}</main>
      <Footer />
      {/* FloatingWhatsApp shifted up on mobile to clear BottomNav */}
      <FloatingWhatsApp />
      <BottomNav />
    </>
  );
}
