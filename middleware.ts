import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/settings/config"

// Helper to create a JSON response from the middleware
function jsonResponse(status: number, data: any) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
}

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
    return jsonResponse(401, { error: "Unauthorized: Missing API Key" });
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
    return jsonResponse(401, { error: errorData.error || "Unauthorized: Invalid API Key" });
  }

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
