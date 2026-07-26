import type { Metadata } from 'next';
import { db } from '@/db';
import { galleryItems } from '@/db/schema';
import { desc } from 'drizzle-orm';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View photos and videos from Progressive Smart Kids School events, activities, and campus life in Gwalior.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let items: any[] = [];
  try {
    // Fetch all gallery items directly for real-time display
    items = await db
      .select({
        id: galleryItems.id,
        url: galleryItems.url,
        caption: galleryItems.caption,
        type: galleryItems.type,
        publicId: galleryItems.publicId,
        createdAt: galleryItems.createdAt,
      })
      .from(galleryItems)
      .orderBy(desc(galleryItems.createdAt));
  } catch (e) {
    console.error('[Gallery Page] Failed to load items:', e);
  }
  return <GalleryPageClient items={items} />;
}
