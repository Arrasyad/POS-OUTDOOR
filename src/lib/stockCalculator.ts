import { Product } from './productsMock';
import { useStore } from '@/store/useStore';

/**
 * Returns an array of date strings (YYYY-MM-DD) for every night in the range.
 * End date is exclusive (because you return the item on the end date morning/afternoon).
 */
function getNightsInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const curr = new Date(start);
  curr.setHours(0, 0, 0, 0);
  
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);

  while (curr < last) {
    // Offset timezone to avoid UTC boundary shifts returning yesterday's date
    const local = new Date(curr);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    dates.push(local.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

/**
 * Checks if a mock booking overlaps with a specific night.
 */
function isBookingOnNight(bookingStart: string, bookingEnd: string, nightStr: string): boolean {
  return nightStr >= bookingStart && nightStr < bookingEnd;
}

/**
 * Calculates dynamically available stock for a product given a date range.
 */
export function getAvailableStock(productId: string, fromDate: Date | undefined, toDate: Date | undefined, products: Product[]): number {
  const product = products.find(p => p.id === productId);
  if (!product) return 0;

  // If no dates provided, assume full stock (we block add to cart elsewhere anyway)
  if (!fromDate || !toDate) {
    // If it's a bundle, calculate base stock of bundle
    if (product.bundleItems && product.bundleItems.length > 0) {
      return getBundleBaseStock(product, products);
    }
    return product.stock;
  }

  // Calculate for Bundle
  if (product.bundleItems && product.bundleItems.length > 0) {
    let maxPossibleBundles = Infinity;
    for (const item of product.bundleItems) {
      const availComponent = getAvailableStock(item.productId, fromDate, toDate, products);
      const possibleWithComponent = Math.floor(availComponent / item.quantity);
      if (possibleWithComponent < maxPossibleBundles) {
        maxPossibleBundles = possibleWithComponent;
      }
    }
    return maxPossibleBundles === Infinity ? 0 : maxPossibleBundles;
  }

  // Calculate for Individual Item
  const requestedNights = getNightsInRange(fromDate, toDate);
  if (requestedNights.length === 0) return product.stock;

  let maxBookedAcrossNights = 0;
  const activeBookings = useStore.getState().activeBookings;

  for (const night of requestedNights) {
    let bookedThisNight = 0;
    for (const booking of activeBookings) {
      if (isBookingOnNight(booking.startDate, booking.endDate, night)) {
        const bookedItem = booking.items.find(i => i.productId === productId);
        if (bookedItem) {
          bookedThisNight += bookedItem.quantity;
        }
      }
    }
    if (bookedThisNight > maxBookedAcrossNights) {
      maxBookedAcrossNights = bookedThisNight;
    }
  }

  const available = product.stock - maxBookedAcrossNights;
  return available > 0 ? available : 0;
}

function getBundleBaseStock(bundleProduct: Product, products: Product[]): number {
  if (!bundleProduct.bundleItems) return 0;
  let maxPossible = Infinity;
  for (const item of bundleProduct.bundleItems) {
    const comp = products.find(p => p.id === item.productId);
    if (!comp) continue;
    const possible = Math.floor(comp.stock / item.quantity);
    if (possible < maxPossible) maxPossible = possible;
  }
  return maxPossible === Infinity ? 0 : maxPossible;
}
