import { NextResponse } from 'next/server';

// Silently absorb external browser extension / scanner pings to prevent 404 terminal logs
export async function GET() {
  return new NextResponse(null, { status: 204 });
}

export async function POST() {
  return new NextResponse(null, { status: 204 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
