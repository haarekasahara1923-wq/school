import { NextResponse } from 'next/server';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, issuedBy, issuedDate, isPublished } = body;

    const updateData: any = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (issuedBy !== undefined) updateData.issuedBy = issuedBy;
    if (issuedDate !== undefined) updateData.issuedDate = issuedDate ? new Date(issuedDate).toISOString().split('T')[0] : null;
    if (typeof isPublished === 'boolean') updateData.isPublished = isPublished;

    const [updated] = await db.update(certifications).set(updateData).where(eq(certifications.id, params.id)).returning();
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update certification' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cert = await db.query.certifications.findFirst({
      where: eq(certifications.id, params.id),
    });

    if (!cert) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    await db.delete(certifications).where(eq(certifications.id, params.id));

    try {
      await deleteFromCloudinary(cert.publicId, 'raw');
    } catch (e) {
      console.error('Cloudinary delete failed (non-fatal):', e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete certification' }, { status: 500 });
  }
}
