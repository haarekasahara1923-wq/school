import { NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema';
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
    const { employeeId, name, designation, department, email, phone, basicSalary, joiningDate, isActive, isPublic, photoUrl, photoPublicId, qualification, experience } = body;

    if (!employeeId || !name || !designation || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updateData: any = {
      employeeId,
      name,
      designation,
      department: department || null,
      email: email || null,
      phone,
      basicSalary: basicSalary ? String(basicSalary) : null,
      joiningDate: joiningDate ? new Date(joiningDate).toISOString().split('T')[0] : undefined,
      qualification: qualification || null,
      experience: experience ? Number(experience) : null,
      updatedAt: new Date(),
    };

    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (photoPublicId !== undefined) updateData.photoPublicId = photoPublicId;

    const [updated] = await db.update(staff).set(updateData).where(eq(staff.id, params.id)).returning();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.update(staff).set({ isDeleted: true, updatedAt: new Date() }).where(eq(staff.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete staff member' }, { status: 500 });
  }
}
