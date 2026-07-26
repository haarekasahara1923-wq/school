import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryAlbums } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const albums = await db.query.galleryAlbums.findMany({
      orderBy: [desc(galleryAlbums.createdAt)],
      with: {
        items: true,
      }
    });
    return NextResponse.json(albums, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, coverUrl, coverPublicId, isPublished } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newAlbum = await db.insert(galleryAlbums).values({
      title,
      description,
      coverUrl,
      coverPublicId,
      isPublished: isPublished ?? false,
    }).returning();

    return NextResponse.json(newAlbum[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
