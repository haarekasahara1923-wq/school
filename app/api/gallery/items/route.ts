import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryItems, galleryAlbums } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const DEFAULT_ALBUM_TITLE = '__default__';

async function getOrCreateDefaultAlbum() {
  const existing = await db
    .select()
    .from(galleryAlbums)
    .where(eq(galleryAlbums.title, DEFAULT_ALBUM_TITLE))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(galleryAlbums)
    .values({
      title: DEFAULT_ALBUM_TITLE,
      isPublished: true,
    })
    .returning();

  return created;
}

export async function GET() {
  try {
    const items = await db
      .select()
      .from(galleryItems)
      .orderBy(desc(galleryItems.createdAt));
    return NextResponse.json({ items }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error: any) {
    console.error('[Gallery Items GET]', error);
    return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url, publicId, caption, type } = body;

    if (!url || !publicId) {
      return NextResponse.json({ error: 'Missing required fields: url and publicId' }, { status: 400 });
    }

    const album = await getOrCreateDefaultAlbum();

    const [newItem] = await db
      .insert(galleryItems)
      .values({
        albumId: album.id,
        url,
        publicId,
        caption: caption || null,
        type: type || 'image',
        sortOrder: 0,
      })
      .returning();

    revalidatePath('/gallery');

    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error('[Gallery Items POST]', error);
    return NextResponse.json({ error: error.message || 'Failed to add gallery item' }, { status: 500 });
  }
}
