import { NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !['admin', 'accountant', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const staffMembers = await db.query.staff.findMany({
      where: eq(staff.isDeleted, false),
      orderBy: [desc(staff.createdAt)],
    });
    return NextResponse.json(staffMembers, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { employeeId, name, designation, department, email, phone, basicSalary, joiningDate } = body;

    if (!employeeId || !name || !designation || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newStaff = await db.insert(staff).values({
      employeeId,
      name,
      designation,
      department,
      email,
      phone,
      basicSalary: basicSalary ? String(basicSalary) : null,
      joiningDate: joiningDate ? new Date(joiningDate).toISOString().split('T')[0] : undefined,
    }).returning();

    return NextResponse.json(newStaff[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add staff member' }, { status: 500 });
  }
}
