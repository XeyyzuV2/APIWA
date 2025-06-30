import { NextResponse } from "next/server"
import { siteConfig, getApiStatus } from "@/settings/config"
import { randomBytes } from "crypto"

function getSecureRandom(max: number): number {
  const randomBuffer = randomBytes(4)
  const randomValue = randomBuffer.readUInt32BE(0)
  return randomValue % max
}

function getEnhancedRandom(max: number): number {
  const crypto1 = getSecureRandom(max)
  const crypto2 = getSecureRandom(max)
  const crypto3 = getSecureRandom(max)
  const timestamp = Date.now() % max
  const mathRandom = Math.floor(Math.random() * max)
  const performance = typeof window !== "undefined" ? window.performance.now() % max : Date.now() % max
  const nanoTime = process.hrtime.bigint() % BigInt(max)

  return Number(
    (BigInt(crypto1) +
      BigInt(crypto2) +
      BigInt(crypto3) +
      BigInt(timestamp) +
      BigInt(mathRandom) +
      BigInt(performance) +
      nanoTime) %
      BigInt(max),
  )
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
    const timestamp = Date.now()
    const nonce1 = randomBytes(16).toString("hex")
    const nonce2 = randomBytes(16).toString("hex")
    const randomParam1 = getSecureRandom(999999999)
    const randomParam2 = getSecureRandom(999999999)
    const randomParam3 = getSecureRandom(999999999)
    const sessionId = randomBytes(12).toString("hex")
    const microtime = process.hrtime.bigint().toString()

    const githubUrl = `https://raw.githubusercontent.com/latesturl/blue-archive-r-img/refs/heads/main/links.json?_t=${timestamp}&_n1=${nonce1}&_n2=${nonce2}&_r1=${randomParam1}&_r2=${randomParam2}&_r3=${randomParam3}&_s=${sessionId}&_mt=${microtime}&_nocache=${Math.random()}&_v2=true`

    const response = await fetch(githubUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image list: ${response.status} ${response.statusText}`)
    }

    const imageUrls = await response.json()

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error("Invalid or empty image list")
    }

    const randomIndex = getEnhancedRandom(imageUrls.length)
    const selectedUrl = imageUrls[randomIndex]
    const imageUrlWithCacheBust = `${selectedUrl}?_t=${timestamp}&_n1=${nonce1}&_n2=${nonce2}&_r1=${randomParam1}&_r2=${randomParam2}&_r3=${randomParam3}&_s=${sessionId}&_mt=${microtime}&_idx=${randomIndex}&_nocache=${Math.random()}&_v2=enhanced&_final=${Date.now()}`

    const imageResponse = await fetch(imageUrlWithCacheBust, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`)
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer()

    return new NextResponse(imageArrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "X-Creator": siteConfig.api.creator,
        "X-Version": "v2",
        "X-Random-Index": randomIndex.toString(),
        "X-Total-Images": imageUrls.length.toString(),
        "X-Selected-URL": selectedUrl,
        "X-Session-ID": sessionId,
        "X-Random-Algorithm": "enhanced-crypto-v2",
        "X-Entropy-Sources": "crypto+timestamp+performance+hrtime",
        "X-Microtime": microtime,
        "X-Nonce-1": nonce1,
        "X-Nonce-2": nonce2,
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
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
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
