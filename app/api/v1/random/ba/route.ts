import { NextResponse } from "next/server"
import { siteConfig, getApiStatus } from "@/settings/config"
import { randomBytes } from "crypto"

// Function untuk generate random yang lebih baik
function getSecureRandom(max: number): number {
  const randomBuffer = randomBytes(4)
  const randomValue = randomBuffer.readUInt32BE(0)
  return randomValue % max
}

// Function untuk generate multiple entropy sources
function getEnhancedRandom(max: number): number {
  const crypto1 = getSecureRandom(max)
  const crypto2 = getSecureRandom(max)
  const timestamp = Date.now() % max
  const mathRandom = Math.floor(Math.random() * max)
  const performance =
    typeof process !== "undefined" && process.hrtime ? Number(process.hrtime.bigint() % BigInt(max)) : Date.now() % max

  // Combine multiple entropy sources
  return (crypto1 + crypto2 + timestamp + mathRandom + performance) % max
}

async function bluearchive() {
  try {
    // Generate cache busting parameters
    const timestamp = Date.now()
    const nonce = randomBytes(16).toString("hex")
    const randomParam = getSecureRandom(999999999)
    const sessionId = randomBytes(8).toString("hex")

    // Fetch dengan cache busting yang agresif
    const listUrl = `https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json?_t=${timestamp}&_n=${nonce}&_r=${randomParam}&_s=${sessionId}&_cb=${Math.random()}&_v=${Date.now()}`

    const response = await fetch(listUrl, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": `VGX-API-Bot/${siteConfig.version} (${timestamp})`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image list: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid or empty image list")
    }

    // Generate random index dengan multiple entropy
    const randomIndex = getEnhancedRandom(data.length)
    const selectedUrl = data[randomIndex]

    // Add cache busting ke image URL juga
    const imageUrlWithCacheBust = `${selectedUrl}?_t=${timestamp}&_n=${nonce}&_r=${randomParam}&_s=${sessionId}&_idx=${randomIndex}&_cb=${Math.random()}&_v=${Date.now()}&_final=${randomBytes(4).toString("hex")}`

    const imageResponse = await fetch(imageUrlWithCacheBust, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "User-Agent": `VGX-API-Bot/${siteConfig.version} (${timestamp})`,
      },
      cache: "no-store",
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`)
    }

    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return {
      buffer,
      index: randomIndex,
      total: data.length,
      url: selectedUrl,
      timestamp,
      sessionId,
      nonce,
    }
  } catch (error) {
    throw error
  }
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
    const result = await bluearchive()

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": result.buffer.length.toString(),
        "X-Creator": siteConfig.api.creator,
        "X-Version": "v1",
        "X-Random-Index": result.index.toString(),
        "X-Total-Images": result.total.toString(),
        "X-Source-URL": result.url,
        "X-Timestamp": result.timestamp.toString(),
        "X-Session-ID": result.sessionId,
        "X-Nonce": result.nonce,
        "X-Random-Algorithm": "enhanced-crypto-v1",
        // Headers anti-cache yang sangat agresif
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "X-Accel-Expires": "0",
        Vary: "Accept-Encoding, User-Agent",
        "Last-Modified": new Date().toUTCString(),
        ETag: `"${result.nonce}-${result.timestamp}"`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An error occurred",
        version: "v1",
        timestamp: Date.now(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
  }
}
