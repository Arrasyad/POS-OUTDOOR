import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, pricePerNight, stock, category, description, imageUrl } = body;

    if (!name || !pricePerNight || stock === undefined || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newId = uuidv4();
    
    await db.insert(products).values({
      id: newId,
      name,
      pricePerNight,
      stock,
      category,
      description: description || null,
      imageUrl: imageUrl || null,
      iconName: null, // Fallback icon if no image (can be handled on frontend)
      isBundle: false, // Simplifying to normal products for now
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
