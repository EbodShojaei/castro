import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// Create an in-memory cache to store request timestamps
const rateLimiter = new LRUCache({
  max: 1000, // Maximum number of keys
  ttl: 1000 * 60 * 15, // Set the time-to-live for entries (15 minutes)
});

// Set the maximum number of requests allowed within the TTL window
const MAX_REQUESTS_PER_WINDOW = 100;

export function middleware(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'; // Get the IP address of the user
  const now = Date.now();

  // If this IP is seen for the first time, create an entry for it
  if (!rateLimiter.has(ip)) {
    rateLimiter.set(ip, []);
  }

  // Retrieve the request timestamps for the current IP
  const timestamps = rateLimiter.get(ip) as number[];

  // Filter out timestamps older than 15 minutes
  const recentRequests = timestamps.filter(
    (timestamp) => now - timestamp < 1000 * 60 * 15,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    // If the number of recent requests exceeds the limit, respond with a 429 Too Many Requests status
    return new NextResponse('Too many requests', { status: 429 });
  }

  // Otherwise, allow the request to proceed and log the timestamp
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);

  return NextResponse.next();
}

// Specify paths where the middleware should be applied globally
export const config = {
  matcher: ['/'], // Apply to all routes
};
