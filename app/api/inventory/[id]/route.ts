import { NextResponse } from 'next/server';
import { db } from '@/db';
import { inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations', 'inventory'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { itemName, category, quantity, unit, location, minQuantity, remarks } = body;

    if (!itemName) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const qty = Number(quantity) || 0;
    const minQty = Number(minQuantity) || 10;

    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (qty === 0) status = 'out_of_stock';
    else if (qty <= minQty) status = 'low_stock';

    const [updated] = await db.update(inventory).set({
      itemName,
      category: category || null,
      quantity: qty,
      unit: unit || null,
      location: location || null,
      minQuantity: minQty,
      status,
      remarks: remarks || null,
      updatedAt: new Date(),
    }).where(eq(inventory.id, params.id)).returning();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inventory item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !['admin', 'operations', 'inventory'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.delete(inventory).where(eq(inventory.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete inventory item' }, { status: 500 });
  }
}
