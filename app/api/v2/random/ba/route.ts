import { NextResponse } from "next/server"
import { siteConfig } from "@/settings/config"
import { randomBytes } from "crypto"

export const dynamic = "force-dynamic";

// Function to generate a more secure random number
function getSecureRandom(max: number): number {
  return randomBytes(4).readUInt32BE(0) % max;
}

async function bluearchive() {
    const timestamp = Date.now();
    const uniqueId = randomBytes(8).toString('hex');
    const listUrl = `https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json?_t=${timestamp}`;

    const response = await fetch(listUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch image list: ${response.statusText}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid or empty image list");

    const randomIndex = getSecureRandom(data.length);
    const selectedUrl = data[randomIndex];

    const imageResponse = await fetch(selectedUrl, { cache: "no-store" });
    if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      buffer,
      index: randomIndex,
      total: data.length,
      url: selectedUrl,
      timestamp,
      uniqueId,
    };
}

export async function GET() {
  try {
    const result = await bluearchive()

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": result.buffer.length.toString(),
        "X-Creator": siteConfig.api.creator,
        "X-Version": "v2",
        "X-Random-Index": result.index.toString(),
        "X-Total-Images": result.total.toString(),
        "X-Source-URL": result.url,
        "X-Timestamp": result.timestamp.toString(),
        "X-Unique-ID": result.uniqueId,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Random BA API v2 Error:", error)
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An error occurred",
        version: "v2",
      },
      {
        status: 500,
      },
    )
  }
}
