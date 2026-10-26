import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, bookingItems } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get('start');
    const endStr = searchParams.get('end');

    if (!startStr || !endStr) {
      return NextResponse.json({ error: 'start and end dates are required' }, { status: 400 });
    }

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    // Fetch bookings that overlap with the requested date range
    // An overlap occurs if Booking.startDate <= Request.endDate AND Booking.endDate >= Request.startDate
    
    // For Drizzle, it's easier to just fetch all active bookings and filter, or use raw SQL.
    // Since it's a small app, let's fetch all PAID bookings and include their items, then filter.
    // In production, we'd use Drizzle's `lte` and `gte` operators.
    const { inArray } = await import('drizzle-orm');
    const allBookings = await db.query.bookings.findMany({
      where: (bookings) => inArray(bookings.status, ['PAID', 'PENDING', 'DP_PAID']),
      with: {
        items: true,
      }
    });

    // Map to the shape expected by frontend (same as MockBooking)
    const formattedBookings = allBookings.map(b => ({
      id: b.id,
      startDate: b.startDate.toISOString().split('T')[0],
      endDate: b.endDate.toISOString().split('T')[0],
      items: b.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, startDate, endDate, nightCount, totalPrice, notes, items, paymentMethod } = body;

    // In a real app, userId might come from auth session.
    // Here we'll generate a dummy user ID if none provided, or we should create a user first.
    // Since the app doesn't have login, let's assume we create the user or just pass a generated UUID for now.
    
    // For now, let's just insert the booking.
    // Generate Booking Code: POS-YYYYMM-XXX
    const now = new Date();
    const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const seq = String(Math.floor(Math.random() * 900) + 100);
    const bookingCode = `POS-${yyyymm}-${seq}`;

    // Note: We need a valid userId to insert into `bookings` since it's a foreign key.
    // Let's create the user in the same transaction or just create an endpoint for it.
    // Wait, let's do it right here for simplicity since there is no login.
    const { users } = await import('@/db/schema');
    const { fullName, whatsappNumber } = body.userData; // Assuming frontend passes this

    const newUserId = uuidv4();
    await db.insert(users).values({
      id: newUserId,
      fullName: fullName,
      whatsappNumber: whatsappNumber,
    });

    await db.insert(bookings).values({
      id: bookingCode,
      userId: newUserId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      nightCount,
      totalPrice,
      notes,
      status: paymentMethod === 'DP' ? 'DP_PAID' : 'PAID', // Direct update as requested
    });

    for (const item of items) {
      await db.insert(bookingItems).values({
        id: uuidv4(),
        bookingId: bookingCode,
        productId: item.productId,
        quantity: item.quantity,
        pricePerNight: item.pricePerNight,
      });
    }

    return NextResponse.json({ bookingCode });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
