import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contactEnquiries, settings } from '@/db/schema';
import { contactEnquirySchema } from '@/lib/validations';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !['admin', 'operations'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const enquiries = await db.query.contactEnquiries.findMany({
      orderBy: [desc(contactEnquiries.createdAt)],
    });
    return NextResponse.json(enquiries, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact enquiries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactEnquirySchema.parse(body);

    const [enquiry] = await db.insert(contactEnquiries).values({
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone,
      address: parsed.address || null,
      subject: parsed.subject || null,
      message: parsed.message,
    }).returning();

    // Fetch WhatsApp number from settings
    let whatsappNumber = process.env.ADMIN_WHATSAPP_NUMBER || '918962678915';
    try {
      const waSetting = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'whatsapp_number'))
        .limit(1);
      if (waSetting.length > 0 && waSetting[0].value) {
        whatsappNumber = waSetting[0].value;
      }
    } catch {}

    return NextResponse.json({ enquiry, whatsappNumber }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit enquiry' }, { status: 400 });
  }
}
