import { db } from "./index";
import { products, bundleItems } from "./schema";
import { productsMock } from "../lib/productsMock";

async function seed() {
  console.log("Seeding products...");
  
  try {
    for (const product of productsMock) {
      // Insert product
      await db.insert(products).values({
        id: product.id,
        name: product.name,
        pricePerNight: product.pricePerNight,
        stock: product.stock,
        category: product.category,
        iconName: product.iconName,
        isBundle: !!product.bundleItems,
        description: product.description || null,
      }).onDuplicateKeyUpdate({ set: { name: product.name } });

      // Insert bundle items if any
      if (product.bundleItems && product.bundleItems.length > 0) {
        for (const item of product.bundleItems) {
          await db.insert(bundleItems).values({
            id: `${product.id}-${item.productId}`,
            bundleId: product.id,
            productId: item.productId,
            quantity: item.quantity,
          }).onDuplicateKeyUpdate({ set: { quantity: item.quantity } });
        }
      }
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
  process.exit(0);
}

seed();
