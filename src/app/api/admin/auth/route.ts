import { NextResponse } from 'next/server';
import { db } from '@/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-pos-outdoor';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password diperlukan' }, { status: 400 });
    }

    // Cari admin di database
    const adminList = await db.select().from(admins).where(eq(admins.username, username));
    const admin = adminList[0];

    if (!admin) {
      return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 401 });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Buat JWT Token
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: admin.id, username: admin.username, name: admin.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h') // Kedaluwarsa dalam 12 jam
      .sign(secretKey);

    const response = NextResponse.json({ success: true });
    
    // Set HTTP-Only cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 jam
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
