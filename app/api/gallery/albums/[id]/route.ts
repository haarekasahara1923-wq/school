import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryAlbums } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, isPublished, coverUrl, coverPublicId } = body;

    const updateData: any = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (typeof isPublished === 'boolean') updateData.isPublished = isPublished;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (coverPublicId !== undefined) updateData.coverPublicId = coverPublicId;

    const [updated] = await db.update(galleryAlbums).set(updateData).where(eq(galleryAlbums.id, params.id)).returning();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.delete(galleryAlbums).where(eq(galleryAlbums.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete album' }, { status: 500 });
  }
}
