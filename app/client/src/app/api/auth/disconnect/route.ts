import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the JWT token by setting the cookie expiration to a past date
  response.cookies.set('jwt_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire the cookie immediately
    path: '/',
    sameSite: 'strict',
  });

  return response;
}
