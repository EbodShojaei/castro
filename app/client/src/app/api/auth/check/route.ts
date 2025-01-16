import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  // Retrieve the JWT token from cookies
  const token = request.cookies.get('jwt_token')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret',
    );

    // Return the decoded address as part of the response
    return NextResponse.json({
      isAuthenticated: true,
      address: (decoded as any).address, // Ensure the address is decoded from the JWT payload
    });
  } catch {
    // If the token is invalid or expired, return an error response
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
