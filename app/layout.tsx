import type { Metadata, Viewport } from 'next';
import './globals.css';
import PwaRegister from '@/components/public/PwaRegister';

export const metadata: Metadata = {
  title: {
    default: 'Progressive Smart Kids School | Prani Chhavani, Gwalior',
    template: '%s | Progressive Smart Kids School',
  },
  description: 'Progressive Smart Kids School — Premier CBSE school in Prani Chhavani, Gwalior (MP). Excellence in education from Class 1st to 12th.',
  keywords: ['Progressive Smart Kids School', 'Gwalior school', 'CBSE school Gwalior', 'Prani Chhavani school', 'Classes 1st to 12th Gwalior'],
  authors: [{ name: 'Progressive Smart Kids School' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://school-iota-gray.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'Progressive Smart Kids School',
    title: 'Progressive Smart Kids School | Prani Chhavani, Gwalior',
    description: 'Premier CBSE school in Prani Chhavani, Gwalior (MP). Classes 1st to 12th.',
    url: 'https://school-iota-gray.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progressive Smart Kids School | Gwalior',
    description: 'Premier CBSE school in Prani Chhavani, Gwalior (MP). Classes 1st to 12th.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PSKS School',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A1F44',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        {/* PWA iOS icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
