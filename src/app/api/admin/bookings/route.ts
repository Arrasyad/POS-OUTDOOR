import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allBookings = await db.query.bookings.findMany({
      orderBy: [desc(bookings.createdAt)],
      with: {
        user: true,
        items: {
          with: {
            product: true
          }
        },
      }
    });

    return NextResponse.json(allBookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
