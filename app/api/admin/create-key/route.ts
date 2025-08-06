import { NextResponse } from 'next/server';
import ApiKey from '@/models/apiKey';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // This is a protected route, so we should add some authentication here.
    // For now, we'll just assume the user is an admin.
    const { tier, limit, duration, owner } = await request.json();

    if (!tier || !limit || !duration) {
      return NextResponse.json({ status: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (tier !== 'pro' && tier !== 'enterprise') {
      return NextResponse.json({ status: false, message: 'Invalid tier' }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGODB_URI as string);
    const now = Date.now();

    const newKey = new ApiKey({
      value: `${tier}_${uuidv4()}`,
      tier,
      owner,
      limit,
      usage: 0,
      resetAt: now + duration,
      duration,
    });

    await newKey.save();

    return NextResponse.json({
      status: true,
      api_key: newKey.value,
      tier: newKey.tier,
      limit: newKey.limit,
      owner: newKey.owner,
      expires_in: `${Math.floor(duration / (1000 * 60 * 60))}h`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: 'Internal server error' }, { status: 500 });
  }
}
