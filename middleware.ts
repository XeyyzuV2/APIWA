import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/settings/config"
import { db } from "@/lib/db"

const RATE_LIMIT = siteConfig.api.rateLimit.limit
const RATE_LIMIT_RESET = siteConfig.api.rateLimit.resetTimeMs
const HEADER_PREFIX = siteConfig.api.rateLimit.headerPrefix

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

async function handleApiRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const publicApiRoutes = ["/api/auth", "/api/register"];

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Handle key management routes separately, they are protected by session
  if (pathname.startsWith("/api/keys") || pathname.startsWith("/api/analytics")) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized: Missing API Key" }), { status: 401 })
  }

  const apiKey = authHeader.substring(7) // "Bearer ".length
  const dbKey = await db.getApiKey(apiKey)

  if (!dbKey) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized: Invalid API Key" }), { status: 401 })
  }

  // --- Rate Limiting (per key) ---
  const now = Date.now()
  const clientData = rateLimitMap.get(dbKey.id)

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(dbKey.id, { count: 1, resetTime: now + RATE_LIMIT_RESET })
  } else {
    clientData.count++
    if (clientData.count > RATE_LIMIT) {
      return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 })
    }
  }

  // --- Logging ---
  await db.logRequest(dbKey.id, request.method, pathname)

  const response = NextResponse.next()
  // Add rate limit headers to the response
  const currentRateLimit = rateLimitMap.get(dbKey.id)
  response.headers.set(`${HEADER_PREFIX}-Limit`, RATE_LIMIT.toString())
  response.headers.set(`${HEADER_PREFIX}-Remaining`, (RATE_LIMIT - (currentRateLimit?.count ?? 0)).toString())
  response.headers.set(`${HEADER_PREFIX}-Reset`, Math.ceil((currentRateLimit?.resetTime ?? 0) / 1000).toString())

  return response
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Maintenance mode check
  if (siteConfig.maintenance.enabled && pathname !== "/maintenance" && !pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/maintenance"
    return NextResponse.rewrite(url)
  }

  if (pathname.startsWith("/api/")) {
    return handleApiRequest(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
