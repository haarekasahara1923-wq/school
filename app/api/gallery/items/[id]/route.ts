import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { caption } = body;

    const [updated] = await db
      .update(galleryItems)
      .set({ caption: caption ?? null, updatedAt: new Date() })
      .where(eq(galleryItems.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    revalidatePath('/gallery');
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update caption' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const item = await db.query.galleryItems.findFirst({
      where: eq(galleryItems.id, params.id),
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await db.delete(galleryItems).where(eq(galleryItems.id, params.id));

    revalidatePath('/gallery');

    try {
      const resourceType = item.type === 'video' ? 'video' : 'image';
      await deleteFromCloudinary(item.publicId, resourceType);
    } catch (e) {
      console.error('Cloudinary delete failed (non-fatal):', e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery item' }, { status: 500 });
  }
}
