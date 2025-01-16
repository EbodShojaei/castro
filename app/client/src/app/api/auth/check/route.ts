import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret',
    );
    return NextResponse.json({
      isAuthenticated: true,
      address: (decoded as any).address, // Type assertion to access `address`
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
