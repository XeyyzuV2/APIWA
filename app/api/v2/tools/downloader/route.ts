import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Validate the URL
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:") {
        return NextResponse.json({ error: "Only HTTPS URLs are allowed" }, { status: 400 });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch file: ${response.statusText}` }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: { "Content-Type": contentType },
    });

  } catch (error) {
    console.error("Downloader error:", error);
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
