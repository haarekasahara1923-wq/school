import { NextResponse } from 'next/server';
import { db } from '@/db';
import { aboutContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await db.select().from(aboutContent);
    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error: any) {
    console.error('[About GET]', error);
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { section, name, designation, message, qualifications, photoUrl, photoPublicId } = body;

    if (!section || !name || !designation || !message) {
      return NextResponse.json({ error: 'Missing required fields: section, name, designation, message' }, { status: 400 });
    }

    if (!['director', 'principal'].includes(section)) {
      return NextResponse.json({ error: 'Invalid section. Must be director or principal.' }, { status: 400 });
    }

    const setData: Record<string, any> = {
      name,
      designation,
      message,
      qualifications: qualifications || null,
      updatedAt: new Date(),
    };
    if (photoUrl !== undefined) setData.photoUrl = photoUrl;
    if (photoPublicId !== undefined) setData.photoPublicId = photoPublicId;

    const existing = await db
      .select({ id: aboutContent.id })
      .from(aboutContent)
      .where(eq(aboutContent.section, section as 'director' | 'principal'))
      .limit(1);

    let updated;
    if (existing.length > 0) {
      const rows = await db
        .update(aboutContent)
        .set(setData)
        .where(eq(aboutContent.section, section as 'director' | 'principal'))
        .returning();
      updated = rows[0];
    } else {
      const rows = await db
        .insert(aboutContent)
        .values({
          section: section as 'director' | 'principal',
          name,
          designation,
          message,
          qualifications: qualifications || null,
          photoUrl: photoUrl || null,
          photoPublicId: photoPublicId || null,
        })
        .returning();
      updated = rows[0];
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[About PUT] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
  }
}
