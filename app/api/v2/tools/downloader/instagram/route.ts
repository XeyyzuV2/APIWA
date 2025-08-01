import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: 'This endpoint is not yet implemented.' }, { status: 501 });
}
