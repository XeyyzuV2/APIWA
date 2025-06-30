import { NextResponse } from "next/server"
import { siteConfig, getApiStatus } from "@/settings/config"
import { randomBytes } from "crypto"

function getSecureRandom(max: number): number {
  // Kombinasi multiple entropy sources
  const crypto1 = randomBytes(4).readUInt32BE(0)
  const crypto2 = randomBytes(4).readUInt32BE(0)
  const timestamp = Date.now()
  const performance = typeof window !== "undefined" ? window.performance.now() : Date.now()
  const mathRandom = Math.floor(Math.random() * 1000000)

  // Combine all entropy sources
  const combined = (crypto1 + crypto2 + timestamp + performance + mathRandom) % max
  return Math.abs(combined)
}

export async function GET() {
  const apiStatus = getApiStatus("/random/ba")

  if (apiStatus.status === "offline") {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: "This API endpoint is currently offline and unavailable. Please try again later.",
          endpoint: "/random/ba",
          apiStatus: "offline",
          version: "v1",
        },
        null,
        2,
      ),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }

  if (siteConfig.maintenance.enabled) {
    return new NextResponse(
      JSON.stringify(
        {
          status: siteConfig.maintenance.apiResponse.status,
          creator: siteConfig.api.creator,
          message: siteConfig.maintenance.apiResponse.message,
        },
        null,
        2,
      ),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }

  try {
    const timestamp = Date.now()
    const nonce = randomBytes(16).toString("hex")
    const randomSeed = getSecureRandom(999999999)
    const sessionId = randomBytes(8).toString("hex")

    const githubUrl = `https://raw.githubusercontent.com/latesturl/blue-archive-r-img/refs/heads/main/links.json?_t=${timestamp}&_n=${nonce}&_r=${randomSeed}&_s=${sessionId}&_nocache=${Math.random()}`

    const response = await fetch(githubUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image list: ${response.status}`)
    }

    const imageUrls = await response.json()

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error("Invalid or empty image list")
    }

    const randomIndex = getSecureRandom(imageUrls.length)
    const selectedUrl = imageUrls[randomIndex] // Declare selectedUrl variable
    const imageUrlWithCacheBust = `${selectedUrl}?_t=${timestamp}&_n=${nonce}&_r=${randomSeed}&_s=${sessionId}&_idx=${randomIndex}&_nocache=${Math.random()}&_v=${Date.now()}`

    const imageResponse = await fetch(imageUrlWithCacheBust, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`)
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer()

    return new NextResponse(imageArrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "X-Creator": siteConfig.api.creator,
        "X-Version": "v1",
        "X-Random-Index": randomIndex.toString(),
        "X-Total-Images": imageUrls.length.toString(),
        "X-Random-Seed": randomSeed.toString(),
        "X-Session-ID": sessionId,
        "X-Timestamp": timestamp.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An error occurred",
        version: "v1",
      },
      { status: 500 },
    )
  }
}
