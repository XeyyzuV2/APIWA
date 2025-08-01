import { NextResponse } from "next/server"
import { siteConfig } from "@/settings/config"
import { randomBytes } from "crypto"

export const dynamic = "force-dynamic";

// Function to generate a more secure random number
function getSecureRandom(max: number): number {
  return randomBytes(4).readUInt32BE(0) % max;
}

async function getBlueArchiveImageUrl() {
    const timestamp = Date.now();
    const listUrl = `https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json?_t=${timestamp}`;

    const response = await fetch(listUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch image list: ${response.statusText}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid or empty image list");

    const randomIndex = getSecureRandom(data.length);
    return data[randomIndex];
}

export async function GET() {
  try {
    const imageUrl = await getBlueArchiveImageUrl();

    return NextResponse.json({
        status: true,
        creator: siteConfig.api.creator,
        image_url: imageUrl,
        version: "v1",
    });

  } catch (error) {
    console.error("Random BA API v1 Error:", error)
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An error occurred",
        version: "v1",
      },
      {
        status: 500,
      },
    )
  }
}
