import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/settings/config"

async function handleApiRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicApiRoutes = ["/api/auth", "/api/register", "/api/internal/validate-key"];

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/keys") || pathname.startsWith("/api/analytics")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized: Missing API Key" }), { status: 401 });
  }

  const apiKey = authHeader.substring(7);

  // Validate the key by calling our internal API route
  const validationUrl = new URL('/api/internal/validate-key', request.url);
  const validationResponse = await fetch(validationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });

  if (!validationResponse.ok) {
    const errorData = await validationResponse.json();
    return new NextResponse(JSON.stringify({ error: errorData.error || "Unauthorized: Invalid API Key" }), { status: 401 });
  }

  // The rest of the logic (rate-limiting, logging) would need to be re-implemented
  // in a way that is compatible with the edge, likely involving another service call.
  // For now, we just validate.

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (siteConfig.maintenance.enabled && pathname !== "/maintenance" && !pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/api/")) {
    return handleApiRequest(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
