import { NextResponse } from "next/server"
import { siteConfig, getApiStatus } from "@/settings/config"
import { randomBytes } from "crypto"

// Function untuk generate random yang lebih baik dengan multiple entropy
function getSecureRandom(max: number): number {
  const randomBuffer = randomBytes(4)
  const randomValue = randomBuffer.readUInt32BE(0)
  return randomValue % max
}

// Function untuk generate random dengan entropy sources yang lebih banyak
function getUltraRandom(max: number): number {
  const crypto1 = getSecureRandom(max)
  const crypto2 = getSecureRandom(max)
  const crypto3 = getSecureRandom(max)
  const timestamp = Date.now() % max
  const mathRandom = Math.floor(Math.random() * max)
  const performance =
    typeof process !== "undefined" && process.hrtime ? Number(process.hrtime.bigint() % BigInt(max)) : Date.now() % max
  const microtime =
    typeof process !== "undefined" && process.hrtime ? Number(process.hrtime.bigint()) % max : Date.now() % max
  const randomFloat = Math.floor(Math.random() * 1000000) % max

  // Combine semua entropy sources dengan algoritma yang lebih complex
  const combined =
    (crypto1 * 7 +
      crypto2 * 11 +
      crypto3 * 13 +
      timestamp * 17 +
      mathRandom * 19 +
      performance * 23 +
      microtime * 29 +
      randomFloat * 31) %
    max
  return Math.abs(combined)
}

async function bluearchive() {
  try {
    // Generate multiple cache busting parameters
    const timestamp = Date.now()
    const nonce1 = randomBytes(16).toString("hex")
    const nonce2 = randomBytes(16).toString("hex")
    const randomParam1 = getSecureRandom(999999999)
    const randomParam2 = getSecureRandom(999999999)
    const randomParam3 = getSecureRandom(999999999)
    const sessionId = randomBytes(12).toString("hex")
    const microtime =
      typeof process !== "undefined" && process.hrtime ? process.hrtime.bigint().toString() : Date.now().toString()
    const uniqueId = randomBytes(8).toString("hex")

    // Fetch dengan cache busting yang sangat agresif
    const listUrl = `https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json?_t=${timestamp}&_n1=${nonce1}&_n2=${nonce2}&_r1=${randomParam1}&_r2=${randomParam2}&_r3=${randomParam3}&_s=${sessionId}&_mt=${microtime}&_uid=${uniqueId}&_cb=${Math.random()}&_v2=ultra&_final=${Date.now()}&_entropy=${randomBytes(4).toString("hex")}`

    const response = await fetch(listUrl, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": `VGX-API-Bot-V2/${siteConfig.version} (${timestamp}-${uniqueId})`,
        "X-Cache-Bypass": "true",
        "X-No-Cache": "true",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image list: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid or empty image list")
    }

    // Generate random index dengan ultra random algorithm
    const randomIndex = getUltraRandom(data.length)
    const selectedUrl = data[randomIndex]

    // Add cache busting yang sangat agresif ke image URL
    const imageUrlWithCacheBust = `${selectedUrl}?_t=${timestamp}&_n1=${nonce1}&_n2=${nonce2}&_r1=${randomParam1}&_r2=${randomParam2}&_r3=${randomParam3}&_s=${sessionId}&_mt=${microtime}&_uid=${uniqueId}&_idx=${randomIndex}&_cb=${Math.random()}&_v2=ultra&_final=${Date.now()}&_entropy=${randomBytes(8).toString("hex")}&_last=${randomBytes(4).toString("hex")}`

    const imageResponse = await fetch(imageUrlWithCacheBust, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "User-Agent": `VGX-API-Bot-V2/${siteConfig.version} (${timestamp}-${uniqueId})`,
        "X-Cache-Bypass": "true",
        "X-No-Cache": "true",
      },
      cache: "no-store",
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`)
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
      nonce1,
      nonce2,
      uniqueId,
      microtime,
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
          version: "v2",
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
        "X-Version": "v2",
        "X-Random-Index": result.index.toString(),
        "X-Total-Images": result.total.toString(),
        "X-Source-URL": result.url,
        "X-Timestamp": result.timestamp.toString(),
        "X-Session-ID": result.sessionId,
        "X-Nonce-1": result.nonce1,
        "X-Nonce-2": result.nonce2,
        "X-Unique-ID": result.uniqueId,
        "X-Microtime": result.microtime,
        "X-Random-Algorithm": "ultra-crypto-v2",
        "X-Entropy-Sources": "crypto+timestamp+performance+hrtime+math+microtime",
        // Headers anti-cache yang ultra agresif
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0, no-transform",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "Cloudflare-CDN-Cache-Control": "no-store",
        "X-Accel-Expires": "0",
        "X-Cache-Bypass": "true",
        "X-No-Cache": "true",
        Vary: "Accept-Encoding, User-Agent, X-Requested-With",
        "Last-Modified": new Date().toUTCString(),
        ETag: `"${result.uniqueId}-${result.timestamp}-${result.index}"`,
        "X-Robots-Tag": "noindex, nofollow, nosnippet, noarchive",
      },
    })
  } catch (error) {
    console.error("Random BA API v2 Ultra Error:", error)
    return NextResponse.json(
      {
        status: false,
        creator: siteConfig.api.creator,
        error: error instanceof Error ? error.message : "An error occurred",
        version: "v2",
        timestamp: Date.now(),
        uniqueId: randomBytes(8).toString("hex"),
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
