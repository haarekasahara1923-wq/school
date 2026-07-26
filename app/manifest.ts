import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Progressive Smart Kids School',
    short_name: 'PSKS School',
    description: 'Premier CBSE School in Prani Chhavani, Gwalior (MP) — Classes 1st to 12th',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0A1F44',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['education'],
  };
}
