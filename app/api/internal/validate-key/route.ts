import { NextResponse } from 'next/server';
import ApiKey from '@/models/apiKey';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGODB_URI as string);

    const dbKey = await ApiKey.findOne({ value: apiKey });

    if (!dbKey) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    const now = Date.now();
    if (now >= dbKey.resetAt) {
      dbKey.usage = 0;
      dbKey.resetAt = now + dbKey.duration;
    }

    if (dbKey.usage >= dbKey.limit) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    dbKey.usage += 1;
    await dbKey.save();

    return NextResponse.json({
      tier: dbKey.tier,
      owner: dbKey.owner,
      remaining: dbKey.limit - dbKey.usage,
      limit: dbKey.limit,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
