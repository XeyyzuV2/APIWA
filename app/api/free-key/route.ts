import { NextResponse } from 'next/server';
import ApiKey from '@/models/apiKey';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const now = Date.now();
    const duration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    const newKey = new ApiKey({
      value: `free_${uuidv4()}`,
      tier: 'free',
      owner: 'xapis-LLC',
      limit: 500,
      usage: 0,
      resetAt: now + duration,
      duration: duration,
    });

    await newKey.save();

    return NextResponse.json({
      status: true,
      api_key: newKey.value,
      tier: newKey.tier,
      limit: newKey.limit,
      expires_in: '2h',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false, message: 'Internal server error' }, { status: 500 });
  }
}
