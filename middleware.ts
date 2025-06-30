import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/settings/config"

const RATE_LIMIT = siteConfig.api.rateLimit.limit
const RATE_LIMIT_WINDOW = siteConfig.api.rateLimit.windowMs
const RATE_LIMIT_RESET = siteConfig.api.rateLimit.resetTimeMs
const HEADER_PREFIX = siteConfig.api.rateLimit.headerPrefix

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitResponse(ip: string) {
  const now = Date.now()
  const clientData = rateLimitMap.get(ip)

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_RESET })
    return {
      remaining: RATE_LIMIT - 1,
      headers: {
        [`${HEADER_PREFIX}-Limit`]: RATE_LIMIT.toString(),
        [`${HEADER_PREFIX}-Remaining`]: (RATE_LIMIT - 1).toString(),
        [`${HEADER_PREFIX}-Reset`]: Math.ceil((now + RATE_LIMIT_RESET) / 1000).toString(),
      },
    }
  }

  if (clientData.count >= RATE_LIMIT) {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: "Rate limit exceeded. Please try again later.",
          limit: RATE_LIMIT,
          window: siteConfig.api.rateLimit.window,
          resetTime: Math.ceil(clientData.resetTime / 1000),
        },
        null,
        2,
      ),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          [`${HEADER_PREFIX}-Limit`]: RATE_LIMIT.toString(),
          [`${HEADER_PREFIX}-Remaining`]: "0",
          [`${HEADER_PREFIX}-Reset`]: Math.ceil(clientData.resetTime / 1000).toString(),
        },
      },
    )
  }

  clientData.count++
  return {
    remaining: RATE_LIMIT - clientData.count,
    headers: {
      [`${HEADER_PREFIX}-Limit`]: RATE_LIMIT.toString(),
      [`${HEADER_PREFIX}-Remaining`]: (RATE_LIMIT - clientData.count).toString(),
      [`${HEADER_PREFIX}-Reset`]: Math.ceil(clientData.resetTime / 1000).toString(),
    },
  }
}

export function middleware(request: NextRequest) {
  const ip = request.ip || "unknown"

  if (siteConfig.maintenance.enabled) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
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

    if (request.nextUrl.pathname !== "/maintenance") {
      const url = request.nextUrl.clone()
      url.pathname = "/maintenance"
      return NextResponse.rewrite(url)
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!request.nextUrl.pathname.startsWith("/api/v1/") && !request.nextUrl.pathname.startsWith("/api/v2/")) {
      return new NextResponse(
        JSON.stringify(
          {
            status: false,
            creator: siteConfig.api.creator,
            error: "API version is required. Please use /api/v1/ or /api/v2/",
          },
          null,
          2,
        ),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
      )
    }

    const rateLimitResult = getRateLimitResponse(ip)

    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    const response = NextResponse.next()

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
