import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Missing required field: address' },
        { status: 400 },
      );
    }

    // Generate unique session ID
    const sessionId = crypto.randomUUID();

    // Generate JWT with session-specific details
    const token = jwt.sign(
      { address, session_id: sessionId },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '30m' }, // 30 minutes expiry
    );

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        address,
        session_id: sessionId,
      },
    });

    // Set the cookie with httpOnly and secure flags for secure storage
    response.cookies.set('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // To prevent cross-site request forgery
      maxAge: 30 * 60 * 1000, // 30 minutes
      path: '/',
    });

    return response;
  } catch {
    // console.error('Error during session creation:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    );
  }
}
