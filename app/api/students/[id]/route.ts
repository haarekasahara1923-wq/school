import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { admissionNo, name, class: studentClass, section, rollNo, parentName, parentPhone, parentEmail, address, dateOfBirth, gender, bloodGroup } = body;

    if (!admissionNo || !name || !studentClass || !parentName || !parentPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [updated] = await db.update(students).set({
      admissionNo,
      name,
      class: studentClass,
      section: section || null,
      rollNo: rollNo || null,
      parentName,
      parentPhone,
      parentEmail: parentEmail || null,
      address: address || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      bloodGroup: bloodGroup || null,
      updatedAt: new Date(),
    }).where(eq(students.id, params.id)).returning();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update student' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await db.update(students).set({ isDeleted: true, updatedAt: new Date() }).where(eq(students.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete student' }, { status: 400 });
  }
}
