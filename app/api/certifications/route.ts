import { NextResponse } from 'next/server';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const certs = await db.query.certifications.findMany({
      orderBy: [desc(certifications.issuedDate)],
    });
    return NextResponse.json(certs, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, fileUrl, publicId, issuedBy, issuedDate } = body;

    if (!title || !fileUrl || !publicId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newCert = await db.insert(certifications).values({
      title,
      description,
      fileUrl,
      publicId,
      issuedBy,
      issuedDate: issuedDate ? new Date(issuedDate).toISOString().split('T')[0] : null,
    }).returning();

    return NextResponse.json(newCert[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}
