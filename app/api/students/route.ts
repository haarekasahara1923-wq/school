import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { studentSchema } from '@/lib/validations';
import { auth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const list = await db.query.students.findMany({
      where: eq(students.isDeleted, false),
      orderBy: [desc(students.createdAt)],
    });
    return NextResponse.json(list, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = studentSchema.parse(body);

    const [newStudent] = await db.insert(students).values({
      admissionNo: parsed.admissionNo,
      name: parsed.name,
      class: parsed.class,
      section: parsed.section || null,
      rollNo: parsed.rollNo || null,
      parentName: parsed.parentName,
      parentPhone: parsed.parentPhone,
      parentEmail: parsed.parentEmail || null,
      address: parsed.address || null,
    }).returning();

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: 400 });
  }
}
