import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: any) {
  // Get JWT token from cookies
  const token = req.cookies.get('jwt_token');

  // If no token redirect to home
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    // Verify token using JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    // If token is valid, proceed with original request
    return NextResponse.next();
  } catch {
    // If token is invalid or expired then redirect to home
    return NextResponse.redirect(new URL('/', req.url));
  }
}

// Specify  paths where middleware should run
export const config = {
  matcher: ['/chat'], // Protect these routes
};
