import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, users } from '@/db/schema';
import { eq, sum, count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Total Pendapatan (Hanya yang PAID atau COMPLETED)
    const revenueResult = await db.select({
      total: sum(bookings.totalPrice)
    }).from(bookings).where(sql`${bookings.status} IN ('PAID', 'COMPLETED')`);
    
    // 2. Transaksi Aktif
    const activeTxResult = await db.select({
      count: count()
    }).from(bookings).where(eq(bookings.status, 'PAID'));

    // 3. Total Pelanggan
    const usersResult = await db.select({
      count: count()
    }).from(users);

    return NextResponse.json({
      totalRevenue: Number(revenueResult[0]?.total || 0),
      activeTransactions: Number(activeTxResult[0]?.count || 0),
      totalCustomers: Number(usersResult[0]?.count || 0),
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
