import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const config = {
  runtime: "nodejs",
};

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();
    if (!apiKey) {
      return NextResponse.json({ valid: false, error: "API key is required" }, { status: 400 });
    }

    const dbKey = await db.getApiKey(apiKey);

    if (!dbKey) {
      return NextResponse.json({ valid: false, error: "Invalid API Key" }, { status: 401 });
    }

    // If the key is valid, we also need to pass back the key's ID for logging and rate-limiting
    return NextResponse.json({ valid: true, keyId: dbKey.id });

  } catch (error) {
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 });
  }
}
