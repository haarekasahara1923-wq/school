import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Progressive Smart Kids School | Prani Chhavani, Gwalior',
    template: '%s | Progressive Smart Kids School',
  },
  description: 'Progressive Smart Kids School — Premier CBSE school in Prani Chhavani, Gwalior (MP). Excellence in education from Class 1st to 12th.',
  keywords: ['Progressive Smart Kids School', 'Gwalior school', 'CBSE school Gwalior', 'Prani Chhavani school', 'Classes 1st to 12th Gwalior'],
  authors: [{ name: 'Progressive Smart Kids School' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kl-ruby.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'Progressive Smart Kids School',
    title: 'Progressive Smart Kids School | Prani Chhavani, Gwalior',
    description: 'Premier CBSE school in Prani Chhavani, Gwalior (MP). Classes 1st to 12th.',
    url: 'https://kl-ruby.vercel.app',
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
      </head>
      <body>{children}</body>
    </html>
  );
}
