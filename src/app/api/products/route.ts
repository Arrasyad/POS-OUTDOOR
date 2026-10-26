import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, bundleItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    const allBundleItems = await db.select().from(bundleItems);

    const formattedProducts = allProducts.map((p) => {
      const pBundleItems = allBundleItems.filter((bi) => bi.bundleId === p.id);
      
      return {
        id: p.id,
        name: p.name,
        pricePerNight: p.pricePerNight,
        stock: p.stock,
        category: p.category,
        iconName: p.iconName,
        imageUrl: p.imageUrl,
        description: p.description || undefined,
        bundleItems: p.isBundle && pBundleItems.length > 0
          ? pBundleItems.map((bi) => ({
              productId: bi.productId,
              quantity: bi.quantity,
            }))
          : undefined,
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
