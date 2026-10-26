import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, pricePerNight, stock, category, description, imageUrl } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (pricePerNight !== undefined) updates.pricePerNight = pricePerNight;
    if (stock !== undefined) updates.stock = stock;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    if (Object.keys(updates).length > 0) {
      await db.update(products).set(updates).where(eq(products.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Gagal update produk' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Check if it's referenced in bundleItems (might fail if foreign keys restrict it, but this is a simple implementation)
    // Actually, ideally we should delete bundleItems referencing this product first, or rely on CASCADE.
    
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Gagal hapus produk' }, { status: 500 });
  }
}
