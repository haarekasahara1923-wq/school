import { NextResponse } from 'next/server';
import { db } from '@/db';
import { inventory } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session || !['admin', 'operations', 'inventory'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await db.query.inventory.findMany({
      orderBy: [desc(inventory.createdAt)],
    });
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !['admin', 'operations', 'inventory'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { itemName, category, quantity, unit, location, status, minQuantity } = body;

    if (!itemName) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const newItem = await db.insert(inventory).values({
      itemName,
      category,
      quantity: Number(quantity) || 0,
      unit,
      location,
      status: status || 'in_stock',
      minQuantity: Number(minQuantity) || 10,
    }).returning();

    return NextResponse.json(newItem[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add inventory item' }, { status: 500 });
  }
}
