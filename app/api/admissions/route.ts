import { NextResponse } from 'next/server';
import { db } from '@/db';
import { admissionEnquiries } from '@/db/schema';
import { admissionEnquirySchema } from '@/lib/validations';
import { desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const enquiries = await db.query.admissionEnquiries.findMany({
      orderBy: [desc(admissionEnquiries.createdAt)],
    });
    return NextResponse.json(enquiries, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = admissionEnquirySchema.parse(body);

    const [enquiry] = await db.insert(admissionEnquiries).values({
      studentName: parsed.studentName,
      classApplying: parsed.classApplying,
      parentName: parsed.parentName,
      phone: parsed.phone,
      email: parsed.email || null,
      address: parsed.address || null,
      message: parsed.message || null,
    }).returning();

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit admission enquiry' }, { status: 400 });
  }
}
